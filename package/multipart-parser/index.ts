export const BUF_CRLF = Buffer.from("\r\n")
export const BUF_CR = Buffer.from("\r") // 0d
export const BUF_LF = Buffer.from("\n") // 0a

export const token = {
    Header: "HEADER",
    Body: "BODY",
    Boundary: "BOUNDARY",
    EOF: "EOF",
}

const separators = {
    BUF_CRLF: 0,
    BUF_CR: 1,
    BUF_LF: 2,
}

export type Token = {
    Type: string,
    Literal: Buffer
}

export type Header = {
    Key: string,
    Value: string
}

const newToken = (type: string, literal: Buffer): Token => {
    return {
        Type: type,
        Literal: literal,
    }
}

export const lexer = (buffer: Buffer, delimiter: string) => {
    const input = buffer
    const boundary = delimiter
    let currPos = 0
    let nextPos = currPos + 1
    let separator = separators.BUF_CRLF // Set the starting separator to CRLF

    const NextToken = () => {
        const startPos = currPos
        while (true) {
            const value = readChar()

            if (value === 0) {
                return newToken(token.EOF, Buffer.alloc(0))
            }

            if (value.equals(BUF_LF)) {
                break
            }
        }

        return newToken(token.Body, input.subarray(startPos, currPos))
    }

    // Helper functions
    const readChar = () => {
        if (currPos >= input.length) {
            return 0
        }

        const value = input.subarray(currPos, nextPos)

        currPos = nextPos
        nextPos += 1

        return value
    }

    const peekChar = () => {
        return input.subarray(nextPos, nextPos + 1)
    }

    return {
        NextToken,
    }
}

export const getBoundary = (contentType: string) => {
    const split = contentType.split(";")
    const boundary = split[1].split("boundary=")[1]
    return boundary
}

// export const lexer = (buffer: Buffer, delimiter: string) => {
//     const input = buffer
//     const boundary = delimiter
//     let currPos = 0
//     let nextPos = currPos + 1
//     let isHeader = false
// 
//     const NextToken = () => {
//         // Contains all contents of a line
//         const arr: number[] = []
//         const lf = BUF_LF.readUint8()
//         let value: number = 0
// 
//         // Keep reading characters until it hits 0 or '\n'
//         while (value = readChar()) {
//             // !TODO
//             // Fix condition wherein it will properly read the data
//             // with new lines and other escape characters.
//             if (value == lf || value == 0) {
//                 break
//             }
//             arr.push(value)
//         }
// 
//         const buff = Buffer.from(arr)
//         switch (buff.toString()) {
//             // If buffer is empty, skip the current iteration.
//             case '':
//                 // Switches the flag to false to state that all the values
//                 // are now a type of body until it reaches another delimiter.
//                 isHeader = false
//                 return NextToken()
//             case `--${boundary}`:
//                 // Switches the flag to true to state that all values are
//                 // are now a type of header until it reaches a separator or empty line.
//                 isHeader = true
//                 return newToken(token.Boundary, buff)
//             case `--${boundary}--`:
//                 return newToken(token.EOF, buff)
//             default:
//                 if (isHeader) {
//                     return newToken(token.Header, buff)
//                 }
//                 return newToken(token.Body, buff)
//         }
//     }
// 
//     // Helper functions
//     const readChar = () => {
//         if (currPos >= input.length) {
//             return 0
//         }
// 
//         const value = input[currPos]
//         currPos = nextPos
//         nextPos += 1
//         return value
//     }
// 
//     return {
//         NextToken,
//     }
// }

import header from "./data/header"
import path from "path"
import fs from "fs/promises"
import {
    BUF_CR,
    BUF_LF,
    getBoundary,
    lexer,
    token
} from "."

const testFileDir = path.basename("data")

describe("lexer", () => {
    it("should turn each line into an actionable token", async () => {
        type TToken = {
            type: string,
            literal: string
        }

        const contentFilePath = "data2.txt"
        const buffer = await fs.readFile(path.join(testFileDir, contentFilePath))

        const delimiter = getBoundary(header["Content-Type"])
        const boundary = `--${delimiter}`

        const l = lexer(buffer, delimiter)
        const tokens: TToken[] = []

        while (true) {
            const tok = l.NextToken()
            tokens.push({
                type: tok.Type,
                literal: tok.Literal.toString()
            })

            if (tok.Type == token.EOF) {
                break;
            }
        }

        console.log(tokens)
    })
})

// describe("lexer", () => {
//     it("should turn each line into an actionable token", async () => {
//         const contentFilePath = "data2.txt"
//         const buffer = await fs.readFile(path.join(testFileDir, contentFilePath))
// 
//         const delimiter = getBoundary(header["Content-Type"])
//         const lf = BUF_LF.readUint8()
//         const cr = BUF_CR.readUint8()
// 
//         const arr: number[] = []
// 
//         buffer.forEach((buffer) => {
//             if (buffer == cr || buffer == lf) {
//                 console.log("Current buffer:", buffer, Buffer.alloc(1, buffer), `${Buffer.alloc(1, buffer).toString()}`)
//                 console.log("Accumulated buffer:", Buffer.from(arr).toString())
//                 arr.length = 0
//             }
// 
//             arr.push(buffer)
//         })
//     })
// })

// describe("lexer", () => {
//     it("should turn each line into an actionable token", async () => {
//         type TToken = {
//             type: string,
//             literal: string
//         }
// 
//         const contentFilePath = "data.txt"
//         const buffer = await fs.readFile(path.join(testFileDir, contentFilePath))
// 
//         const delimiter = getBoundary(header["Content-Type"])
//         const boundary = `--${delimiter}`
// 
//         const testCases = [
//             { type: token.Boundary, literal: boundary },
//             { type: token.Header, literal: 'Content-Disposition: form-data; name="field1"' },
//             { type: token.Body, literal: 'foo' },
//             { type: token.Boundary, literal: boundary },
//             { type: token.Header, literal: 'Content-Disposition: form-data; name="field2"' },
//             { type: token.Body, literal: 'bar' },
//             { type: token.Boundary, literal: boundary },
//             { type: token.Header, literal: 'Content-Disposition: form-data; name="file" filename="example.txt"' },
//             { type: token.Body, literal: 'The quick brown fox jumps over the lazy dog' },
//             { type: token.EOF, literal: `${boundary}--` },
//         ]
// 
//         const l = lexer(buffer, delimiter)
//         const tokens: TToken[] = []
// 
//         while (true) {
//             const tok = l.NextToken()
//             tokens.push({
//                 type: tok.Type,
//                 literal: tok.Literal.toString()
//             })
// 
//             if (tok.Type == token.EOF) {
//                 break;
//             }
//         }
// 
//         expect(tokens).toEqual(testCases)
//     })
// 
//     it("should properly tokenize data with line feeds and tabs", async () => {
//         type TToken = {
//             type: string,
//             literal: string
//         }
// 
//         const contentFilePath = "data2.txt"
//         const buffer = await fs.readFile(path.join(testFileDir, contentFilePath))
// 
//         const delimiter = getBoundary(header["Content-Type"])
//         const boundary = `--${delimiter}`
// 
//         const testCases = [
//             { type: token.Boundary, literal: boundary },
//             { type: token.Header, literal: 'Content-Disposition: form-data; name="field1"' },
//             { type: token.Body, literal: 'foo\nbar' },
//             { type: token.Boundary, literal: boundary },
//             { type: token.Header, literal: 'Content-Disposition: form-data; name="field2"' },
//             { type: token.Body, literal: 'fizz\nbar' },
//             { type: token.Boundary, literal: boundary },
//             { type: token.Header, literal: 'Content-Disposition: form-data; name="file" filename="example.txt"' },
//             { type: token.Body, literal: 'The quick\t\tbrown\n\nfox jumps\nover the\t\t\tlazy dog' },
//             { type: token.EOF, literal: `${boundary}--` },
//         ]
// 
//         const l = lexer(buffer, delimiter)
//         const tokens: TToken[] = []
// 
//         while (true) {
//             const tok = l.NextToken()
//             tokens.push({
//                 type: tok.Type,
//                 literal: tok.Literal.toString()
//             })
// 
//             if (tok.Type == token.EOF) {
//                 break;
//             }
//         }
// 
//         expect(tokens).toEqual(testCases)
//     })
// })

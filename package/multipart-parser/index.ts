const BUF_CRLF = Buffer.from('\r\n')
const BUF_CR = Buffer.from('\r') // 0d
const BUF_LF = Buffer.from('\n') // 0a

export const multipartParser = (boundary: string, buff: Buffer) => {
    const _boundary = `--${boundary}`
    const arr: number[] = []
    const t = BUF_LF.readUint8()

    let pos = 0
    while (pos < buff.length) {
        // console.log(
        //     buff.subarray(pos, pos + 1),
        //     buff.subarray(pos, pos + 1).toString(),
        // )
        arr.push(buff[pos])

        if (buff[pos] == t) {
            const val = Buffer.from(arr)
            console.log(val.toString())
            arr.splice(0)
        }
        ++pos
    }
}

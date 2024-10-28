import testHeader from "./data/header.json"
import path from "path"
import fs from "fs/promises"
import { multipartParser } from "."

const testDir = "./data"
const testBody = path.join(testDir, "body.txt")

describe.skip("file reader", () => {
    it("should open file", async () => {
        const t = async () => {
            await fs.readFile(testBody)
        }

        await expect(t())
            .resolves
            .not
            .toThrow()
    })
})

describe("multipart parser", () => {
    it("should parse the binary data of the content", async () => {
        const contentType = testHeader["content-type"].split("; ")
        const boundary = contentType[1].split("boundary=")[1]

        const file = await fs.readFile(testBody)
        const result = multipartParser(boundary, file)
        expect(result)
            .toEqual({
                name: "foo",
                value: "bar"
            })
    })
})

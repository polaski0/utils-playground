import { schema } from "../schema/schema-function"

describe("schema module", () => {
    test("parsing string should fail", () => {
        const stringParser = schema.string()

        expect(() => stringParser.parse(1)).toThrow()
    })

    test("parsing string should pass", () => {
        const stringParser = schema.string()

        const result = stringParser.parse("Hello")
        expect(typeof result).toBe("string")
    })
})

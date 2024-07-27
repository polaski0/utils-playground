import { v } from "."

describe("string", () => {
    const strSchema = v.string();

    it("should return true", () => {
        const result = strSchema.parse("asdf")
        expect(result.valid).toBe(true)
    })

    it("should return false", () => {
        const result = strSchema.parse()
        expect(result.valid).toBe(false)
    })

    it("should allow undefined value and return true", () => {
        const strSchema = v.string().optional();
        const result = strSchema.parse()
        expect(result.valid).toBe(true)
    })
})

describe("object", () => {
    const objSchema = v.object({
        name: v.string(),
        address: v.object({
            street: v.string()
        }),
    });

    it("should return true", () => {
        const result = objSchema.parse({
            name: "John",
            address: {
                street: "123"
            }
        })

        expect(result.valid).toBe(true)
    })

    it("should return false", () => {
        const result = objSchema.parse({})
        expect(result.valid).toBe(false)
    })
})

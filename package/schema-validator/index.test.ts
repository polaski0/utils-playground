import { v } from "."

describe("string", () => {
    const strSchema = v.string();

    it("should return true", () => {
        const result = strSchema.validate("asdf")
        expect(result.valid).toBe(true)
    })

    it("should allow undefined value and return true", () => {
        const strSchema = v.string().optional();
        const result = strSchema.validate()
        expect(result.valid).toBe(true)
    })

    it("should throw ValidationError on empty input", () => {
        expect(strSchema.validate().errors).not.toBeUndefined()
    })

    it("should throw ValidationError on wrong input type", () => {
        expect(strSchema.validate(1).errors).not.toBeUndefined()
    })

    it("should throw ValidationError on optional but wrong input type", () => {
        const strSchema = v.string().optional();
        expect(strSchema.validate(1).errors).not.toBeUndefined()
    })
})

describe("object", () => {
    const objSchema = v.object({
        name: v.string(),
        address: v.object({
            street: v.string(),
        }),
    });

    it("should return true", () => {
        const result = objSchema.validate({
            name: "John",
            address: {
                street: "123"
            }
        })
        expect(result.valid).toBe(true)
    })

    it("should throw ValidationError on empty object", () => {
        const objSchema = v.object({
            name: v.string().min(2),
            age: v.number(),
            address: v.object({
                street: v.string(),
                bar: v.string(),
                addtl: v.object({
                    zipCode: v.string(),
                    foo: v.string()
                }).optional()
            }),
        });

        const result = objSchema.validate({
            name: "J",
            age: 1,
            address: {
                street: "123",
                addtl: {}
            }
        })

        console.log(result.errors?._result.issues)

        expect(result.errors).not.toBeUndefined()
    })
})

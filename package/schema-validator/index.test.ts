import { v } from "."

describe.skip("string", () => {
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

describe.skip("object", () => {
    it("should return true", () => {
        const objSchema = v.object({
            name: v.string(),
            address: v.object({
                street: v.string(),
            }),
        });

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
            address: v.object({
                street: v.string(),
                bar: v.string(),
                addtl: v.object({
                    zipCode: v.string(),
                    foo: v.string()
                }).optional()
            }),
        })

        const result = objSchema.validate({
            name: "J",
            address: {
                street: "123",
                addtl: {}
            }
        })

        expect(result.errors).not.toBeUndefined()
    })
})

describe("array", () => {
    it("should return true", () => {
        const stringsSchema = v.array(v.string());
        const result = stringsSchema.validate(["Foo", "Bar"])
        expect(result.valid).toBe(true)
    })

    it("should return false", () => {
        const stringsSchema = v.array(v.string());
        const result = stringsSchema.validate([1, 2])
        expect(result.valid).toBe(false)
    })

    it("should validate array of objects to true", () => {
        const stringsSchema = v.array(
            v.object({
                name: v.string(),
                address: v.object({
                    street: v.string()
                })
            })
        );
        const result = stringsSchema.validate([
            {
                name: "John",
                address: {
                    street: "123"
                }
            },
            {
                name: "Jane",
                address: {
                    street: "234"
                }
            }
        ])

        expect(result.valid).toBe(true)
    })

    it("should validate array of objects to false", () => {
        const stringsSchema = v.array(
            v.object({
                name: v.string(),
                address: v.object({
                    street: v.string()
                })
            })
        );
        const result = stringsSchema.validate([
            {
                name: "John",
                address: {
                    street: "123"
                }
            },
            {
                name: "Jane",
                address: {
                    street: 123
                }
            }
        ])

        expect(result.valid).toBe(false)
    })
})

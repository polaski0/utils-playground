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
        expect(() => strSchema.validate()).toThrow(v.ValidationError)
    })

    it("should throw ValidationError on wrong input type", () => {
        expect(() => strSchema.validate(1)).toThrow(v.ValidationError)
    })

    it("should throw ValidationError on optional but wrong input type", () => {
        const strSchema = v.string().optional();
        expect(() => strSchema.validate(1)).toThrow(v.ValidationError)
    })
})

describe("object", () => {
    const objSchema = v.object({
        name: v.string(),
        address: v.object({
            street: v.string(),
        }),
    });

    it.skip("should return true", () => {
        const result = objSchema.validate({
            name: "John",
            address: {
                street: "123"
            }
        })
        console.log("Object Result", result)
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
                })
            }),
        });

        try {
            objSchema.validate({
                name: "J",
                address: {
                    street: "123",
                }
            })
        } catch (err) {
            if (err instanceof v.ValidationError) {
                console.log("Error Result", err.format())
            }
        }

        expect(() => objSchema.validate({})).toThrow(v.ValidationError)
    })
})

import { v } from "."

describe("string", () => {
    const strSchema = v.string()

    it("should return true", () => {
        const result = strSchema.validate("asdf")
        expect(result.valid).toBe(true)
    })

    it("custom validation should return true", () => {
        const strSchema = v.string().custom(
            (v) => v === "asdf",
            "Not equal to asdf"
        )
        const result = strSchema.validate("asdf")
        expect(result.valid).toBe(true)
    })

    it("custom validation should return false", () => {
        const strSchema = v.string().custom(
            (v) => v === "asdf",
            "Not equal to asdf"
        )
        const result = strSchema.validate("qwe")
        expect(result.valid).toBe(false)
    })

    it("should allow undefined value and return true", () => {
        const strSchema = v.string().optional()
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
        const strSchema = v.string().optional()
        expect(strSchema.validate(1).errors).not.toBeUndefined()
    })
})

describe("object", () => {
    it("should return true", () => {
        const objSchema = v.object({
            name: v.string(),
            address: v.object({
                street: v.string(),
            }),
        })

        const result = objSchema.validate({
            name: "John",
            address: {
                street: "123"
            }
        })
        expect(result.valid).toBe(true)
    })

    it("should throw ValidationError on incomplete object", () => {
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
            }
        })

        expect(result.errors).not.toBeUndefined()
    })

    it("should return false on wrong type", () => {
        const objSchema = v.object({
            name: v.string(),
            address: v.object({
                street: v.string(),
            }),
        })
        const result = objSchema.validate([])

        expect(result.valid).toBe(false)
    })

    it("should compare and return false", () => {
        const objSchema = v.object({
            effectiveDate: v.date(),
            expiryDate: v.date(),
        }).custom(
            (data) => {
                return data.effectiveDate.getTime() < data.expiryDate.getTime()
            },
            "Effective must not be greater than expiry"
        )

        const result = objSchema.validate({
            effectiveDate: new Date("07/29/2024"),
            expiryDate: new Date("07/28/2024"),
        })

        expect(result.valid).toBe(false)
    })

    it("should compare nested values and return false", () => {
        const objSchema = v.object({
            num1: v.number(),
            nested1: v.object({
                num2: v.number()
            }),
        }).custom(
            (data) => {
                return data.num1 > data.nested1.num2
            },
            "Num 1 must be greater than num 2"
        )

        const result = objSchema.validate({
            num1: 1,
            nested1: {
                num2: 2
            }
        })

        expect(result.valid).toBe(false)
    })
})

describe("array", () => {
    it("should return true", () => {
        const stringsSchema = v.array(v.string())
        const result = stringsSchema.validate(["Foo", "Bar"])
        expect(result.valid).toBe(true)
    })

    it("should return false", () => {
        const stringsSchema = v.array(v.string())
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
        )
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
        )
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

    it("should validate array of strings to false", () => {
        const stringsSchema = v.array(v.string()).min(2).max(3)
        const result = stringsSchema.validate([
            "foo",
            "bar",
            "fizz",
            "buzz",
        ])

        expect(result.valid).toBe(false)
    })

    it("should validate wrong input to false", () => {
        const stringsSchema = v.array(v.string()).min(2).max(3)
        const result = stringsSchema.validate({})

        expect(result.valid).toBe(false)
    })
})

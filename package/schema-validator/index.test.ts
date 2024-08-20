import * as v from "."

describe("string", () => {
    const strSchema = v.string()

    it("should return true", () => {
        const result = strSchema.validate("asdf")
        expect(result.valid).toBe(true)
    })

    it("should return true for custom validation", () => {
        const result = strSchema
            .custom(
                (v) => v === "asdf",
                "Not equal to asdf"
            )
            .validate("asdf")
        expect(result.valid).toBe(true)
    })

    it("should return false for custom validation", () => {
        const result = strSchema
            .custom(
                (v) => v === "asdf",
                "Not equal to asdf"
            )
            .validate("qwe")
        expect(result.valid).toBe(false)
    })

    it("should not fail if there is no data to transform", () => {
        const strSchema = v.string().optional().trim()
        const result = strSchema.validate()
        expect(result.valid).toBe(true)
    })

    it("should prefix \"123\" to the validated value using transform() method", () => {
        const strSchema = v.string()
            .transform((v) => "123" + v)
        const result = strSchema.validate("456")
        expect(result.value).toBe("123456")
    })

    it("should allow undefined value and return true", () => {
        const strSchema = v.string().optional()
        const result = strSchema.validate()
        expect(result.valid).toBe(true)
    })

    it("should return ValidationError on empty input", () => {
        expect(strSchema.validate().errors).not.toBeUndefined()
    })

    it("should return ValidationError on wrong input type", () => {
        expect(strSchema.validate(1).errors).not.toBeUndefined()
    })

    it("should return ValidationError on optional but wrong input type", () => {
        expect(strSchema.optional().validate(1).errors).not.toBeUndefined()
    })

    it("should return ValidationError on optional but wrong input type", () => {
        expect(strSchema.optional().validate(1).errors).not.toBeUndefined()
    })

    it("should return true on email validation", () => {
        const strSchema = v.string().email()
        expect(
            strSchema
                .validate("test@example.com")
                .valid
        )
            .toBe(true)
    })

    it("should return false on email validation with special characters", () => {
        // Sample emails with special characters
        // àsdfg_test@domain.com
        // ásdfg.test@domain.com
        // sdfgɱ@domain.com
        // eͫsdfg@domain.com
        const strSchema = v.string().email()
        const result = strSchema
            .validate("sdfgɱ@domain.com")
        expect(result.valid).toBe(false)
    })
})

describe("number", () => {
    it("should return true", () => {
        const numSchema = v.number()
        expect(numSchema.validate(1).valid).toBe(true)
    })

    it("should return false", () => {
        const numSchema = v.number()
        expect(numSchema.validate("").valid).toBe(false)
    })
})

describe("date", () => {
    it("should return true", () => {
        const dateSchema = v.date()
        expect(dateSchema.validate(new Date()).valid).toBe(true)
    })

    it("should return false", () => {
        const dateSchema = v.date()
        expect(dateSchema.validate("01/01/2000").valid).toBe(false)
    })
})

describe("null", () => {
    it("should return true", () => {
        const nullSchema = v.null()
        expect(nullSchema.validate(null).valid).toBe(true)
    })

    it("should return false", () => {
        const nullSchema = v.null()
        expect(nullSchema.validate().valid).toBe(false)
    })
})

describe("undefined", () => {
    it("should return true", () => {
        const undefinedSchema = v.undefined()
        expect(undefinedSchema.validate().valid).toBe(true)
    })

    it("should return false", () => {
        const undefinedSchema = v.undefined()
        expect(undefinedSchema.validate(1).valid).toBe(false)
    })
})

describe("literal", () => {
    it("should return true", () => {
        const literalSchema = v.literal("123")
        expect(literalSchema.validate("123").valid).toBe(true)
    })

    it("should return false", () => {
        const literalSchema = v.literal("123")
        expect(literalSchema.validate(123).valid).toBe(false)
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

    it("should return true on optional key", () => {
        const objSchema = v.object({
            first_name: v.string(),
            middle_name: v.string().optional(),
            last_name: v.string(),
        })

        const result = objSchema.validate({
            first_name: "John",
            last_name: "Doe",
        })
        expect(result.valid).toBe(true)
    })

    it("should return ValidationError on incomplete object", () => {
        const objSchema = v.object({
            name: v.string().min(2),
            address: v.object({
                street: v.string(),
                bar: v.string(),
                addtl: v.object({
                    zipCode: v.number(),
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

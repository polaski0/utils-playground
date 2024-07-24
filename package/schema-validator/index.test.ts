import { s } from "."

describe("string schema validator", () => {
    it("should validate empty string schema to true", () => {
        const stringSchema = s.string().optional()
        const result = stringSchema.validate("");
        expect(result.isValid).toBe(true)
    })

    it("should validate required string schema to false", () => {
        const stringSchema = s.string();
        const result = stringSchema.validate("");
        expect(result.isValid).toBe(false)
    })
})

describe("number schema validator", () => {
    it("should validate empty number schema to true", () => {
        const numberSchema = s.number().optional()
        const result = numberSchema.validate();
        expect(result.isValid).toBe(true)
    })

    it("should validate required number schema to false", () => {
        const numberSchema = s.number();
        const result = numberSchema.validate("");
        expect(result.isValid).toBe(false)
    })
})

describe("object schema validator", () => {
    it("should validate nested object schema to true", () => {
        const objectSchema = s.object({
            name: s.string(),
            age: s.number(),
            address: s.object({
                zipCode: s.string(),
                street_1: s.string().optional(),
            }).optional(),
        });

        const data = {
            name: "John",
            age: 21,
            address: {
                zipCode: "1111",
            },
        };

        const result = objectSchema.validate(data);
        expect(result.isValid).toBe(true)
    })

    it("should validate nested object schema with optional address to true", () => {
        const objectSchema = s.object({
            name: s.string(),
            age: s.number(),
            address: s.object({
                zipCode: s.string().optional(),
                street_1: s.string(),
            }).optional(),
        });

        const data = {
            name: "John",
            age: 21,
        };

        const result = objectSchema.validate(data);
        expect(result.isValid).toBe(true);
    })

    it("should validate nested object schema with missing zip code to false", () => {
        const objectSchema = s.object({
            name: s.string(),
            age: s.number(),
            address: s.object({
                zipCode: s.string(),
                street_1: s.string(),
            }),
        });

        const data = {
            name: "John",
            age: 21,
            address: {
                street_1: "123 Street",
            },
        };

        const result = objectSchema.validate(data);
        expect(result.isValid).toBe(false);
    })

    it("should validate nested object schema with required address to false", () => {
        const objectSchema = s.object({
            name: s.string(),
            age: s.number(),
            address: s.object({
                zipCode: s.string(),
                street_1: s.string().optional(),
            })
        });

        const data = {
            name: "John",
            age: 21,
        };

        const result = objectSchema.validate(data);
        expect(result.isValid).toBe(false);
    })
})

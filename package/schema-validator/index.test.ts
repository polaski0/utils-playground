import { s } from "."

describe("string schema validator", () => {
    it("should validate empty string schema to true", () => {
        const stringSchema = s.string()
        const result = stringSchema.validate("");
        expect(result.isValid).toBe(true)
    })

    it("should validate required string schema to false", () => {
        const stringSchema = s.string().required()
        const result = stringSchema.validate("");
        expect(result.isValid).toBe(false)
    })
})

describe("number schema validator", () => {
    it("should validate empty number schema to true", () => {
        const numberSchema = s.number()
        const result = numberSchema.validate();
        expect(result.isValid).toBe(true)
    })

    it("should validate required number schema to false", () => {
        const numberSchema = s.number().required()
        const result = numberSchema.validate("");
        expect(result.isValid).toBe(false)
    })
})

describe("object schema validator", () => {
    it("should validate nested object schema to true", () => {
        const objectSchema = s.object({
            name: s.string().required(),
            age: s.number().required(),
            address: s.object({
                zipCode: s.string().required(),
                street_1: s.string(),
            }),
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

    it("should validate nested object schema without required address to true", () => {
        const objectSchema = s.object({
            name: s.string().required(),
            age: s.number().required(),
            address: s.object({
                zipCode: s.string().required(),
                street_1: s.string(),
            }),
        });

        const data = {
            name: "John",
            age: 21,
        };

        const result = objectSchema.validate(data);
        expect(result.isValid).toBe(true);
    })

    it("should validate nested object schema with required zip code to false", () => {
        const objectSchema = s.object({
            name: s.string().required(),
            age: s.number().required(),
            address: s.object({
                zipCode: s.string().required(),
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
})

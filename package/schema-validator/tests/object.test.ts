import { s } from "..";

describe("object schema validator", () => {
    it("should validate nested object schema to true", () => {
        const objectSchema = s.object({
            name: s.string(),
            age: s.number(),
            address: s.object({
                zipCode: s.string(),
                street_1: s.string().optional(),
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
        expect(result.valid).toBe(true)
    })

    it("should validate nested object schema with optional address to true", () => {
        const objectSchema = s.object({
            name: s.string(),
            age: s.number(),
            address: s.object({
                zipCode: s.string(),
                street_1: s.string(),
            }).optional(),
        });

        const data = {
            name: "John",
            age: 21,
        };

        const result = objectSchema.validate(data);
        expect(result.valid).toBe(true);
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
                street_1: 123,
            },
        };

        const result = objectSchema.validate(data);
        expect(result.valid).toBe(false);
    })

    it("should validate nested object schema with required address to false", () => {
        const objectSchema = s.object({
            name: s.string(),
            age: s.number(),
            address: s.object({
                zipCode: s.string(),
                street_1: s.string(),
            })
        });

        const data = {
            name: "John",
            age: 21,
        };

        const result = objectSchema.validate(data);
        expect(result.valid).toBe(false);
    })
})


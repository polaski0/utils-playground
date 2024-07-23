import { s } from "."

describe("schema validator", () => {
    it("should validate string schema to true", () => {
        const stringSchema = s.string()
        const result = stringSchema.validate("");
        expect(result.isValid).toBe(true)
    })

    it("should validate object schema to true", () => {
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

    it("should validate object schema to true", () => {
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

    it("should validate object schema to false", () => {
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

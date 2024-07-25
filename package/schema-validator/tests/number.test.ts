import { s } from "..";

describe("number schema validator", () => {
    it("should validate empty number schema to true", () => {
        const numberSchema = s.number().optional()
        const result = numberSchema.validate();
        expect(result.valid).toBe(true)
    })

    it("should validate number schema with min to true", () => {
        const numberSchema = s.number().min(2)
        const result = numberSchema.validate(2);
        expect(result.valid).toBe(true)
    })

    it("should validate required number schema to false", () => {
        const numberSchema = s.number();
        const result = numberSchema.validate("");
        expect(result.valid).toBe(false)
    })

    it("should validate number schema with min to false", () => {
        const numberSchema = s.number().min(2);
        const result = numberSchema.validate(1);
        expect(result.valid).toBe(false)
    })
})

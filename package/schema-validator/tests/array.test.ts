import { s } from "..";

describe("array schema validator", () => {
    it("should validate empty array schema to true", () => {
        const arraySchema = s.array().optional()
        const result = arraySchema.validate();
        expect(result.valid).toBe(true)
    })

    it("should validate array schema with min to true", () => {
        const arraySchema = s.array().min(2)
        const result = arraySchema.validate([1, 2]);
        expect(result.valid).toBe(true)
    })

    it("should validate the array >= 4 and <= 6 to true", () => {
        const arraySchema = s.array().min(4).max(6);
        const result = arraySchema.validate([1, 2, 3, 4, 5]);
        expect(result.valid).toBe(true)
    })

    it("should validate required array schema to false", () => {
        const arraySchema = s.array();
        const result = arraySchema.validate();
        expect(result.valid).toBe(false)
    })

    it("should validate array schema with min to false", () => {
        const arraySchema = s.array().min(2);
        const result = arraySchema.validate([1]);
        expect(result.valid).toBe(false)
    })

    it("should validate the array >= 4 and <= 6 to false", () => {
        const arraySchema = s.array().min(4).max(6);
        const result = arraySchema.validate([1, 2]);
        expect(result.valid).toBe(false)
    })
})

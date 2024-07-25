import { s } from ".."

describe("string schema validator", () => {
    it("should validate empty string schema to true", () => {
        const stringSchema = s.string().optional()
        const result = stringSchema.validate("");
        expect(result.valid).toBe(true)
    })

    it("should validate string schema with min to true", () => {
        const stringSchema = s.string().min(5);
        const result = stringSchema.validate("Hello");
        expect(result.valid).toBe(true)
    })

    it("should validate string with length >= 8 and <= 12 to true", () => {
        const stringSchema = s.string().min(8).max(12);
        const result = stringSchema.validate("123456789");
        expect(result.valid).toBe(true)
    })

    it("should validate required string schema to false", () => {
        const stringSchema = s.string();
        const result = stringSchema.validate("");
        expect(result.valid).toBe(false)
    })

    it("should validate string schema with min to false", () => {
        const stringSchema = s.string().min(5);
        const result = stringSchema.validate("Hell");
        expect(result.valid).toBe(false)
    })

    it("should validate string with length >= 8 and <= 12 to false", () => {
        const stringSchema = s.string().min(8).max(12);
        const result = stringSchema.validate("1234567");
        expect(result.valid).toBe(false)
    })
})

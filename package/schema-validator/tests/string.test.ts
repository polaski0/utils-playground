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
})

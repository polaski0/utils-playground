import { s } from "..";

describe("boolean schema validator", () => {
    it("should validate empty boolean schema to true", () => {
        const booleanSchema = s.boolean().optional()
        const result = booleanSchema.validate();
        expect(result.valid).toBe(true)
    })

    it("should validate boolean value on boolean schema to true", () => {
        const booleanSchema = s.boolean();
        const result = booleanSchema.validate(false);
        expect(result.valid).toBe(true)
    })

    it("should validate non-boolean value on boolean schema to false", () => {
        const booleanSchema = s.boolean();
        const result = booleanSchema.validate(2);
        expect(result.valid).toBe(false)
    })
})

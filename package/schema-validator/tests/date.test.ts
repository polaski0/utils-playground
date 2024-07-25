import { s } from "..";

describe("date schema validator", () => {
    it("should validate date schema to true", () => {
        const dateSchema = s.date();
        const result = dateSchema.validate(new Date());
        expect(result.valid).toBe(true)
    })
})

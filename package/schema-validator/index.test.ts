import { v } from "."

describe.skip("string", () => {
    it("should validate to true", () => {

    })
})

describe("object", () => {
    it("should throw ValError", () => {
        const schema = v.object({
            first_name: v.string(),
            middle_name: v.string(),
            last_name: v.string(),
            address: v.object({
                street: v.string(),
                addtl: v.object({
                    house_no: v.string(),
                    landmark: v.string()
                })
            })
        })

        const payload = {
            first_name: "John",
            last_name: "Doe"
        }

        try {
            const t0 = performance.now()
            schema.validate(payload)
            const t1 = performance.now()
            console.log("Passed", t1 - t0)
        } catch (err) {
            if (err instanceof v.ValError) {
                console.log(err._result)
                const t0 = performance.now()
                const formattedError = err.format()
                const t1 = performance.now()
                console.log("Error", t1 - t0, formattedError)
            }
        }

        expect(() => schema.validate(payload)).toThrow(v.ValError)
    })
})

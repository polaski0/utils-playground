import { v } from "."

describe.skip("string", () => {
    it("should validate to true", () => {

    })
})

describe("object", () => {
    it("should validate to true", () => {
        const schema = v.object({
            first_name: v.string(),
            last_name: v.string(),
            address: v.object({
                street: v.string(),
                addtl: v.object({
                    house_no: v.string(),
                    landmark: v.string()
                })
            })
        })

        const result = schema.validate({
            first_name: "John"
        })
        console.log(result?.issues)
    })
})

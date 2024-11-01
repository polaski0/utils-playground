import { number } from "./schemas/number/number"
import { object } from "./schemas/object/object"
import { string } from "./schemas/string/string"
import { trim } from "./transformers/trim"
import { max } from "./validators/max"
import { min } from "./validators/min"
import { transform } from "./transformers/transform"
import { parse } from "./methods/parse"
import { ValidationError, format } from "./error"
import { email } from "./validators/email"
import { oneOf } from "./validators/oneOf"
import { array } from "./schemas/array/array"

describe("error", () => {
  it("should properly display necessary errors based on its path", () => {
    const schema = object({
      username: string(
        "Invalid username.",
        [
          trim(),
          email(),
        ]
      ),
      password: string(
        "Invalid password.",
        [
          trim(),
          min(4),
          max(8),
        ]
      ),
      address: object({
        zipCode: number(),
        street: string([
          transform(value => {
            return `${value} St.`
          })
        ])
      }),
      roles: array(
        string([
          oneOf(["user", "admin"]),
        ]),
        [
          min(1, "Should have at least one role.")
        ]
      )
    })

    try {
      parse(schema, {
        roles: ["", "customer"]
        // roles: []
      })
    } catch (err) {
      format((err as ValidationError))
    }

    try {
      const schema = string([min(1), oneOf(["h", "e", "l", "o",])])
      parse(schema, "")
    } catch (err) {
      format((err as ValidationError))
    }
  })
})

import { parse } from "../../methods/parse"
import { boolean } from "./boolean"

describe("boolean", () => {
  it("should only accept booleans", () => {
    const schema = boolean()

    expect(() => parse(schema, "true")).toThrow()
    expect(() => parse(schema, "false")).toThrow()
    expect(() => parse(schema, 0)).toThrow()
    expect(() => parse(schema, 1)).toThrow()
    expect(() => parse(schema, null)).toThrow()
    expect(() => parse(schema, undefined)).toThrow()
    expect(() => parse(schema, [])).toThrow()
    expect(() => parse(schema, {})).toThrow()
  })

  it("should accept booleans", () => {
    const schema = boolean()

    expect(() => parse(schema, true)).not.toThrow()
    expect(() => parse(schema, false)).not.toThrow()
  })
})

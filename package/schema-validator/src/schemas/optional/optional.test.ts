import { parse } from "../../methods/parse"
import { object } from "../object/object"
import { string } from "../string/string"
import { optional } from "./optional"

describe("optional", () => {
  it("should allow undefined values", () => {
    const schema = optional(string())

    expect(() => parse(schema, undefined)).not.toThrow()
    expect(() => parse(schema, "")).not.toThrow()
    expect(() => parse(schema, null)).toThrow()
    expect(() => parse(schema, 0)).toThrow()
    expect(() => parse(schema, false)).toThrow()
  })

  it("should allow undefined values on objects", () => {
    const schema = object({
      first_name: string(),
      middle_name: optional(string()),
      last_name: string(),
    })

    expect(() => parse(schema, {
      first_name: "John",
      last_name: "Doe",
    })).not.toThrow()
    expect(() => parse(schema, {
      first_name: "John",
      middle_name: undefined,
      last_name: "Doe",
    })).not.toThrow()
    expect(() => parse(schema, {
      first_name: "John",
      middle_name: 0,
      last_name: "Doe",
    })).toThrow()
    expect(() => parse(schema, {
      first_name: "John",
      middle_name: null,
      last_name: "Doe",
    })).toThrow()
  })
})

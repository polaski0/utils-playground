import { parse } from "../../methods/parse"
import { object } from "../object/object"
import { string } from "../string/string"
import { nullable } from "./nullable"

describe("nullable", () => {
  it("should only allow null values", () => {
    const schema = nullable(string())

    expect(() => parse(schema, null)).not.toThrow()
    expect(() => parse(schema, undefined)).toThrow()
    expect(() => parse(schema, [])).toThrow()
    expect(() => parse(schema, {})).toThrow()
    expect(() => parse(schema, 0)).toThrow()
    expect(() => parse(schema, false)).toThrow()
  })

  it("should only allow null values on objects", () => {
    const schema = object({
      first_name: string(),
      middle_name: nullable(string()),
      last_name: string(),
    })

    expect(() => parse(schema, {
      first_name: "John",
      middle_name: null,
      last_name: "Doe",
    })).not.toThrow()
    expect(() => parse(schema, {
      first_name: "John",
      middle_name: 0,
      last_name: "Doe",
    })).toThrow()
    expect(() => parse(schema, {
      first_name: "John",
      last_name: "Doe",
    })).toThrow()
  })
})

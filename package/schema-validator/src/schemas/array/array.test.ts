import { parse } from "../../methods/parse"
import { max } from "../../validators/max"
import { min } from "../../validators/min"
import { number } from "../number/number"
import { string } from "../string/string"
import { array } from "./array"

describe("array", () => {
  it("should only accept arrays", () => {
    const schema = array(string())

    expect(() => parse(schema, "foo")).toThrow()
    expect(() => parse(schema, 123)).toThrow()
    expect(() => parse(schema, undefined)).toThrow()
    expect(() => parse(schema, {})).toThrow()
  })

  it("should accept arrays", () => {
    const stringArraySchema = array(string())
    const numberArraySchema = array(number())

    expect(() => parse(stringArraySchema, ["foo", "bar"])).not.toThrow()
    expect(() => parse(numberArraySchema, [1, 2, 3])).not.toThrow()
  })

  it("should throw on empty arrays", () => {
    const schema = array(string([min(1)]), [min(1)])

    expect(() => parse(schema, [])).toThrow()
  })

  it("should throw error on mismatched array types", () => {
    const schema = array(string())

    expect(() => parse(schema, [1, 2, 3])).toThrow()
    expect(() => parse(schema, ["foo", 1])).toThrow()
  })

  it("should validate schemas with multiple options", () => {
    const schema = array(string([min(1), max(2)]))

    expect(() => parse(schema, ["h", "e", "ll", "o",])).not.toThrow()
    expect(() => parse(schema, ["hello", "world"])).toThrow()
    expect(() => parse(schema, ["", "hi"])).toThrow()
  })
})

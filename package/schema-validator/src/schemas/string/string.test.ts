import { parse } from "../../methods/parse"
import { transform } from "../../transformers/transform"
import { trim } from "../../transformers/trim"
import { max } from "../../validators/max"
import { min } from "../../validators/min"
import { oneOf } from "../../validators/oneOf"
import { string } from "./string"

describe("string", () => {
  it("should only accept strings", () => {
    const schema = string()
    expect(() => parse(schema, 123)).toThrow()
    expect(() => parse(schema, undefined)).toThrow()
    expect(() => parse(schema, [])).toThrow()
    expect(() => parse(schema, {})).toThrow()
  })

  it("should accept string", () => {
    const schema = string()
    expect(() => parse(schema, "123")).not.toThrow()
    expect(() => parse(schema, "")).not.toThrow()
  })

  it("should accept string with minimum length", () => {
    const schema = string([min(1)])
    expect(() => parse(schema, "1")).not.toThrow()
    expect(() => parse(schema, "12")).not.toThrow()
  })

  it("should not accept string without the minimum length", () => {
    const schema = string([min(4)])
    expect(() => parse(schema, "1")).toThrow()
    expect(() => parse(schema, "123")).toThrow()
  })

  it("should accept string with multiple options", () => {
    const schema = string([min(2), max(4)])
    expect(() => parse(schema, "12")).not.toThrow()
    expect(() => parse(schema, "123")).not.toThrow()
    expect(() => parse(schema, "1234")).not.toThrow()
  })

  it("should trim the string", () => {
    const schema = string([trim()])
    const value = "   this is a string with a large space    "
    const expected = value.trim()
    const result = parse(schema, value)
    expect(result).toBe(expected)
  })

  it("should accept custom transformations", () => {
    const schema = string([transform((value) => {
      return value.trim() + "123"
    })])
    const value = "   this is a string with a large space    "
    const expected = value.trim() + "123"
    const result = parse(schema, value)
    expect(result).toBe(expected)
  })

  it("should accept multiple options with custom transformations and pass the validation", () => {
    const schema = string(
      "Not a valid password.",
      [
        trim(),
        min(4),
        max(8)
      ]
    )
    const value = "   12345678    "
    expect(() => parse(schema, value)).not.toThrow()
  })

  it("should only accept specific values", () => {
    const schema = string([oneOf(["foo", "bar"])])
    expect(() => parse(schema, "foo")).not.toThrow()
    expect(() => parse(schema, "bar")).not.toThrow()
    expect(() => parse(schema, "fizz")).toThrow()
    expect(() => parse(schema, "buzz")).toThrow()
  })
})

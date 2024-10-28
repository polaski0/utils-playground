import { parse } from "../../methods/parse"
import { transform } from "../../transformers/transform"
import { max } from "../../validators/max"
import { min } from "../../validators/min"
import { number } from "./number"

describe("number", () => {
  it("should only accept numbers", () => {
    const schema = number()
    expect(() => parse(schema, "123")).toThrow()
    expect(() => parse(schema, undefined)).toThrow()
    expect(() => parse(schema, [])).toThrow()
    expect(() => parse(schema, {})).toThrow()
  })

  it("should accept numbers", () => {
    const schema = number([])
    expect(() => parse(schema, 123)).not.toThrow()
    expect(() => parse(schema, 0)).not.toThrow()
  })

  it("should pass validation based options provided", () => {
    const schema = number([min(1)])
    expect(() => parse(schema, 2)).not.toThrow()
    expect(() => parse(schema, 1)).not.toThrow()
  })

  it("should not pass validation based options provided", () => {
    const schema = number([min(1), max(2)])
    expect(() => parse(schema, 0)).toThrow()
    expect(() => parse(schema, -1)).toThrow()
    expect(() => parse(schema, 3)).toThrow()
  })

  it("should not pass validation based options provided", () => {
    const schema = number([min(1), max(2)])
    expect(() => parse(schema, 0)).toThrow()
    expect(() => parse(schema, -1)).toThrow()
    expect(() => parse(schema, 3)).toThrow()
  })
})

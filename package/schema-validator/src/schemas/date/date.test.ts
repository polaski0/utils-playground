import { parse } from "../../methods/parse"
import { date } from "./date"

describe("date", () => {
  it("should only accept dates", () => {
    const schema = date()

    expect(() => parse(schema, "01/01/2001")).toThrow()
    expect(() => parse(schema, new Date().getTime())).toThrow()
    expect(() => parse(schema, 1_000_000)).toThrow()
    expect(() => parse(schema, [])).toThrow()
    expect(() => parse(schema, {})).toThrow()
    expect(() => parse(schema, undefined)).toThrow()
    expect(() => parse(schema, null)).toThrow()
  })

  it("should accept dates", () => {
    const schema = date()

    expect(() => parse(schema, new Date())).not.toThrow()
    expect(() => parse(schema, new Date("01/01/2001"))).not.toThrow()
    expect(() => parse(schema, new Date(0))).not.toThrow()
  })
})

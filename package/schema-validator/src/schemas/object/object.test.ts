import { parse } from "../../methods/parse"
import { transform } from "../../transformers/transform"
import { trim } from "../../transformers/trim"
import { Infer } from "../../types"
import { max } from "../../validators/max"
import { min } from "../../validators/min"
import { number } from "../number/number"
import { optional } from "../optional/optional"
import { string } from "../string/string"
import { object } from "./object"

describe("object", () => {
  it("should only accept objects", () => {
    const schema = object({
      username: string(),
      password: string()
    })

    expect(() => parse(schema, "")).toThrow()
    expect(() => parse(schema, [])).toThrow()
    expect(() => parse(schema, 1)).toThrow()
    expect(() => parse(schema, undefined)).toThrow()
    expect(() => parse(schema, null)).toThrow()
  })

  it("should accept objects", () => {
    const schema = object({
      username: string(),
      password: string()
    })

    expect(() => parse(schema, {
      username: "",
      password: "",
    })).not.toThrow()
  })

  it("should pass the schema validation", () => {
    const schema = object({
      fizz: object({
        buzz: string(),
        foo: object({
          bar: string(),
        })
      })
    })

    expect(() => parse(schema, {
      fizz: {
        buzz: "fizzbuzz",
        foo: {
          bar: "foobar"
        }
      }
    })).not.toThrow()
  })

  it("should throw an error", () => {
    const schema = object({
      fizz: object({
        buzz: string("This should be a string"),
        foo: object({
          bar: string("This should also be a string"),
        })
      })
    })

    expect(() => parse(schema, {})).toThrow()
    expect(() => parse(schema, {
      fizz: {
        buzz: "",
      }
    })).toThrow()
    expect(() => parse(schema, {
      fizz: {
        buzz: "",
        foo: {}
      }
    })).toThrow()
  })

  it("should pass a nested object with multiple transformations and validations", () => {
    const schema = object({
      username: string([
        trim(),
        min(4)
      ]),
      password: optional(
        string(
          "Should be a valid password.",
          [
            trim(),
            min(4),
            max(8)
          ]
        )
      ),
      address: optional(
        object({
          zipCode: number(),
          street: string([
            transform(value => {
              return `${value} St.`
            })
          ])
        })
      )
    })

    const value = {
      username: "   user   ",
      password: "       psswrd12   ",
      // address: {
      //   zipCode: 1234,
      //   street: "123"
      // }
    }
    const expected = {
      username: "user",
      password: "psswrd12",
      // address: {
      //   zipCode: 1234,
      //   street: "123 St."
      // }
    }

    const getValue = (value: unknown) => {
      return JSON.parse(JSON.stringify(value))
    }

    expect(() => {
      parse(schema, getValue(value))
    })
      .not
      .toThrow()

    const result = parse(schema, getValue(value))
    expect(result).toEqual(expected)
  })

  it("should removed unecessary keys that is not included in the schema", () => {
    const schema = object({
      username: string([trim(), min(4)]),
      password: string(
        "Should be a valid password.",
        [trim(), min(4), max(8)]
      ),
    })

    const value = {
      username: "   user   ",
      password: "       psswrd12   ",
      address: {
        zipCode: 1234,
        street: "123"
      }
    }
    const expected = {
      username: "user",
      password: "psswrd12",
    }

    const getValue = (value: unknown) => {
      return JSON.parse(JSON.stringify(value))
    }

    expect(() => {
      parse(schema, getValue(value))
    })
      .not
      .toThrow()

    const result = parse(schema, getValue(value))
    expect(result).toEqual(expected)
  })
})

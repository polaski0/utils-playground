import { ValidationError } from "../../error"
import { applyOptions } from "../../methods/applyOptions"
import { parseArgs } from "../../methods/parseArgs"
import { BaseSchema, Options } from "../../types"

export type NumberSchema<TOutput = number> = BaseSchema<number, TOutput>

/**
  * Creates a number validation schema
  */
export function number(opts?: Options<number>): NumberSchema
export function number(message?: string, opts?: Options<number>): NumberSchema
export function number(
  arg1?: string | Options<number>,
  arg2?: Options<number>
): NumberSchema {
  const { message, opts } = parseArgs(arg1, arg2)

  return {
    parse(input, info) {
      if (typeof input !== "number") {
        throw new ValidationError([
          {
            type: "number",
            message: message || "Invalid type",
            input: input,
            ...info
          }
        ])
      }
      return applyOptions(input, opts, { ...info, type: "number" })
    },
  }
}

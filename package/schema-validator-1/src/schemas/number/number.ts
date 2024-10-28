import { ValidationError } from "../../error"
import { applyOptions } from "../../methods/applyOptions"
import { parseArgs } from "../../methods/parseArgs"
import { BaseSchema, Options } from "../../types"

type NumberSchema<TOutput = number> = BaseSchema<number, TOutput> & {
  schema: "number"
}

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
    schema: "number",
    parse(input, info) {
      if (typeof input !== "number") {
        throw new ValidationError([
          {
            message: message || "Invalid type",
            input: input,
            ...info
          }
        ])
      }

      return applyOptions(input, opts)
    },
  }
}

import { ValidationError } from "../../error"
import { applyOptions } from "../../methods/applyOptions"
import { parseArgs } from "../../methods/parseArgs"
import { BaseSchema, Options } from "../../types"

type StringSchema<TOutput = string> = BaseSchema<string, TOutput> & {
  schema: "string"
}

/**
  * Creates a string validation schema
  */
export function string(opts?: Options<string>): StringSchema
export function string(message?: string, opts?: Options<string>): StringSchema
export function string(
  arg1?: string | Options<string>,
  arg2?: Options<string>
): StringSchema {
  const { message, opts } = parseArgs(arg1, arg2)

  return {
    schema: "string",
    parse(input, info) {
      if (typeof input !== "string") {
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
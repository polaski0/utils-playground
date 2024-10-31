import { ValidationError } from "../../error"
import { applyOptions } from "../../methods/applyOptions"
import { parseArgs } from "../../methods/parseArgs"
import { BaseSchema, Options } from "../../types"

export type BooleanSchema<TOutput = boolean> = BaseSchema<boolean, TOutput>

/**
  * Creates a string validation schema
  */
export function boolean(opts?: Options<boolean>): BooleanSchema
export function boolean(message?: string, opts?: Options<boolean>): BooleanSchema
export function boolean(
  arg1?: string | Options<boolean>,
  arg2?: Options<boolean>
): BooleanSchema {
  const { message, opts } = parseArgs(arg1, arg2)

  return {
    parse(input, info) {
      if (typeof input !== "boolean") {
        throw new ValidationError([
          {
            type: "boolean",
            message: message || "Invalid type",
            input: input,
            ...info,
          }
        ])
      }
      return applyOptions(input, opts, { ...info, type: "boolean" })
    },
  }
}

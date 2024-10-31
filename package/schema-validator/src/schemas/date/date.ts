import { ValidationError } from "../../error"
import { applyOptions } from "../../methods/applyOptions"
import { parseArgs } from "../../methods/parseArgs"
import { BaseSchema, Options } from "../../types"

export type DateSchema<TOutput = Date> = BaseSchema<Date, TOutput>

/**
  * Creates a string validation schema
  */
export function date(opts?: Options<Date>): DateSchema
export function date(message?: string, opts?: Options<Date>): DateSchema
export function date(
  arg1?: string | Options<Date>,
  arg2?: Options<Date>
): DateSchema {
  const { message, opts } = parseArgs(arg1, arg2)

  return {
    parse(input, info) {
      if (!(input instanceof Date)) {
        throw new ValidationError([
          {
            type: "date",
            message: message || "Invalid type",
            input: input,
            ...info,
          }
        ])
      }
      return applyOptions(input, opts, { ...info, type: "date" })
    },
  }
}

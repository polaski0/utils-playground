import { Issue, ValidationError } from "../../error"
import { applyOptions } from "../../methods/applyOptions"
import { parseArgs } from "../../methods/parseArgs"
import { BaseSchema, Options } from "../../types"

export type ArraySchema<TOutput = Array<unknown>> = BaseSchema<Array<unknown>, TOutput>

/**
  * Creates an array validation schema
  */
export function array(schema: BaseSchema, opts?: Options<Array<unknown>>): ArraySchema
export function array(schema: BaseSchema, message?: string, opts?: Options<Array<unknown>>): ArraySchema
export function array(
  schema: BaseSchema, // Allow accepting of multiple schema types in the future. 
  arg2?: string | Options<Array<unknown>>,
  arg3?: Options<Array<unknown>>
): ArraySchema {
  const { message, opts } = parseArgs(arg2, arg3)

  return {
    parse(input, info) {
      if (!(input instanceof Array)) {
        throw new ValidationError([
          {
            type: "array",
            message: message || "Invalid type",
            input: input,
            ...info,
          }
        ])
      }

      const issues: Issue[] = []
      for (const value of input) {
        try {
          schema.parse(value, { ...info, input: value })
        } catch (err) {
          issues.push(...(err as ValidationError).issues)
        }
      }

      if (issues.length) {
        throw new ValidationError(issues)
      }

      return applyOptions(input, opts, { ...info, type: "array" })
    },
  }
}

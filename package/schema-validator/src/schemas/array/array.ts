import { Issue, ValidationError } from "../../error"
import { applyOptions } from "../../methods/applyOptions"
import { parseArgs } from "../../methods/parseArgs"
import { BaseSchema, Options, Output } from "../../types"

export type ArraySchema<TInput extends BaseSchema, TOutput = Array<Output<TInput>>> = BaseSchema<Array<unknown>, TOutput>

/**
  * Creates an array validation schema
  */
export function array<TSchema extends BaseSchema>(schema: TSchema, opts?: Options<Array<unknown>>): ArraySchema<TSchema>
export function array<TSchema extends BaseSchema>(schema: TSchema, message?: string, opts?: Options<Array<unknown>>): ArraySchema<TSchema>
export function array<TSchema extends BaseSchema>(
  schema: TSchema, // Allow accepting of multiple schema types in the future. 
  arg2?: string | Options<Array<Output<TSchema>>>,
  arg3?: Options<Array<Output<TSchema>>>
): ArraySchema<TSchema> {
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

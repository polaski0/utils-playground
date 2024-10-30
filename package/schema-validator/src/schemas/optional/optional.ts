import { BaseSchema, Input, Output } from "../../types"

type OptionalSchema<
  TInput extends BaseSchema,
  TOutput = Output<TInput> | undefined
> = BaseSchema<TInput, TOutput>

/**
  * Creates an optional schema
  */
export function optional<TSchema extends BaseSchema>(
  schema: TSchema,
): OptionalSchema<TSchema> {
  return {
    parse(input, info) {
      if (!input) {
        return undefined
      }

      return schema.parse(input, info)
    },
  }
}
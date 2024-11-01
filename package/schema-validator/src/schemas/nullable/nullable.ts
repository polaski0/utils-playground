import { BaseSchema, Output } from "../../types"

type NullableSchema<
  TInput extends BaseSchema,
  TOutput = Output<TInput> | null
> = BaseSchema<TInput, TOutput>

/**
  * Creates an nullable schema
  */
export function nullable<TSchema extends BaseSchema>(
  schema: TSchema,
): NullableSchema<TSchema> {
  return {
    parse(input, info) {
      if (input === null) {
        return null
      }

      return schema.parse(input, info)
    },
  }
}

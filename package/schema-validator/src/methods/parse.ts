import { BaseSchema, Output } from "../types";

/**
  * Validates an input value against a schema.
  *
  * This function takes an input value and applies the validation rules defined in the provided schema.
  * The schema parameter is expected to be an instance of BaseSchema, which defines the structure of the data to be validated.
  * The input parameter can be any type (unknown), representing the data to be validated against the schema.
  *
  * If the input is valid according to the schema, this function returns the parsed output value of type SchemaOutput<TSchema>.
  * Otherwise, it throws a ValidationError with a list of validation issues.
  *
  * @param {BaseSchema} [schema] - The validation schema to apply.
  * @param {unknown} input - The data to be validated.
  * @throws {ValidationError} If the input does not match the schema.
  */
export function parse<TSchema extends BaseSchema>(
  schema: TSchema,
  input: unknown
): Output<TSchema> {
  return schema.parse(input)
}

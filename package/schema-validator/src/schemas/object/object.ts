// Assume the following schema below
//
// const schema = object({
//   fizz: object({
//     buzz: string(),
//     foo: object({
//       bar: string(),
//     })
//   })
// })
//
// The object's parse method should be able to
// validate through deep nested objects.
//
// Objectives
// - Object schema should only return validated keys.
// - Should have an `abortEarly` option.
// - Should include path / keys of the schemas that
// caused an error.

import { Issue, ValidationError } from "../../error";
import { BaseSchema } from "../../types";

export type TShape<T> = {
  [K in keyof T]: T[K] extends BaseSchema
  ? T[K]
  : never
}

export type ObjectSchema<TInput, TOutput = TInput> = BaseSchema<TShape<TInput>, TOutput>

/**
  * Creates an object validation schema
  */
export function object<TSchema>(
  schema: TShape<TSchema>,
  message?: string,
): ObjectSchema<TSchema> {
  return {
    parse(input, info) {
      const issues: Issue[] = []
      const output = {} as Record<keyof TShape<TSchema>, any> // Fix `any` type

      // Should be controlled by a flag such as `abortEarly`
      // to determine if it will continue to validate values
      // nested deeper.
      if (
        typeof input !== "object" ||
        input instanceof Array ||
        input === undefined ||
        input === null
      ) {
        issues.push({
          type: "object",
          message: message || "Invalid type",
          path: info?.path, // Fix path
          input: input
        })
      }

      for (const key in schema) {
        const _s = schema[key]

        // Checks if the input is not undefined and that the key exists in
        // the object before accessing to prevent errors being thrown when
        // accessing undefined values
        let _val: unknown
        if (input && key in input) {
          _val = (input as Record<string | number | symbol, unknown>)[key]
        } else {
          _val = undefined
        }

        try {
          const parsedValue = _s.parse(_val, {
            input: _val,
            path: info?.path ? `${info?.path}.${key}` : key, // Fix path builder
            ...info,
          })

          // Only includes existing keys in the schema.
          if (input && key in input) {
            output[key] = parsedValue
          }
        } catch (error) {
          issues.push(...(error as ValidationError).issues)
        }
      }

      if (issues.length) {
        throw new ValidationError(issues)
      }

      return output
    }
  }
}


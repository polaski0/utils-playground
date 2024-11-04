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
import { applyOptions } from "../../methods/applyOptions";
import { parseArgs } from "../../methods/parseArgs";
import { BaseSchema, Options, Output } from "../../types";

type ObjectShape = Record<string, BaseSchema>

// To type as exactly as the generic, removing any
// additional type operators for a cleaner look.
type Is<T> = T
type Mapper<T> = Is<{
    [K in keyof T]: T[K]
}>

type ObjectOutput<TInput extends ObjectShape> =
    Mapper<{
        [K in keyof TInput]: Output<TInput[K]>
    }>

export type ObjectSchema<
    TInput extends ObjectShape,
    TOutput = ObjectOutput<TInput>
> = BaseSchema<
    TInput,
    TOutput
>

/**
  * Creates an object validation schema
  */
export function object<TSchema extends ObjectShape>(
    schema: TSchema,
    arg2?: string | Options<TSchema>,
    arg3?: Options<TSchema>
): ObjectSchema<TSchema> {
    const { message, opts } = parseArgs(arg2, arg3)
    return {
        parse(input, info) {
            const issues: Issue[] = []
            const output = {} as Record<keyof TSchema, unknown>

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
                if (input && key in (input as Record<string, unknown>)) {
                    _val = (input as Record<string | number | symbol, unknown>)[key]
                } else {
                    _val = undefined
                }

                try {
                    const parsedValue = _s.parse(_val, {
                        ...info,
                        input: _val,
                        path: info?.path ? `${info?.path}.${key}` : key, // Fix path builder
                    })

                    output[key] = parsedValue
                } catch (error) {
                    issues.push(...(error as ValidationError).issues)
                }
            }

            if (issues.length) {
                throw new ValidationError(issues)
            }

            return applyOptions(output as TSchema, opts, { ...info, type: "array" })
        }
    }
}

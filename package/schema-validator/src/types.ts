import { Issue } from "./error"

export type Info = Partial<
  Pick<
    Issue,
    | "input"
    | "path"
  >
>

export type OptionsInfo = Info & Pick<Issue, "type">

export type Options<TValue> = ((input: TValue, info: OptionsInfo) => TValue)[]

export type BaseSchema<TInput = any, TOutput = TInput> = {
  parse(input: unknown, info?: Info): TOutput
  _types?: { input: TInput, output: TOutput } // Internal types
}

export type Input<TSchema extends BaseSchema> = NonNullable<TSchema["_types"]>["input"]
export type Output<TSchema extends BaseSchema> = NonNullable<TSchema["_types"]>["output"]

export type Infer<T extends BaseSchema> = Output<T>

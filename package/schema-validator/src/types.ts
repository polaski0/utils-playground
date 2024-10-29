import { Issue } from "./error"

export type Info = Partial<
  Pick<
    Issue,
    | "input"
    | "path"
  >
>

export type OptionsInfo = Info & Pick<Issue, "type">

export type BaseSchema<TInput = any, TOutput = TInput> = {
  parse(input: TInput, info?: Info): TOutput
}

export type Options<TValue> = ((input: TValue, info: OptionsInfo) => TValue)[]

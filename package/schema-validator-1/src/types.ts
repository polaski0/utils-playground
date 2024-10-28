import { Issue } from "./error"

export type Info = Partial<
  Pick<
    Issue,
    | "input"
    | "path"
  >
>

export type BaseSchema<TInput = unknown, TOutput = TInput> = {
  parse(input: TInput, info?: Info): TOutput
}

export type Options<TValue> = ((input: TValue) => TValue)[]

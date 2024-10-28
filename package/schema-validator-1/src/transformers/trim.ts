import { transform } from "./transform"

export function trim<TInput extends string>() {
  return transform((input: TInput) => {
    return input.trim()
  })
}

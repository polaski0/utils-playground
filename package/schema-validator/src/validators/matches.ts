import { ValidationError } from "../error"
import { OptionsInfo } from "../types"

export function matches<TInput extends string>(pattern: string | RegExp, message?: string) {
  return (input: TInput, info: OptionsInfo) => {
    if (!input.match(pattern)) {
      throw new ValidationError([
        {
          message: message || `Does not match "${pattern.toString()}"`,
          input: input,
          ...info,
        }
      ])
    }
    return input
  }
}

import { ValidationError } from "../error"
import { OptionsInfo } from "../types"

export function min<TInput extends number | string | any[]>(min: number, message?: string) {
  return (input: TInput, info: OptionsInfo) => {
    if (typeof input === "number") {
      if (input < min) {
        throw new ValidationError([
          {
            message: message || `Must be greater than or equal ${min}`,
            input: input,
            ...info,
          }
        ])
      }
    } else {
      if (input.length < min) {
        throw new ValidationError([
          {
            message: message || `Must have a minimum length of ${min}`,
            input: input,
            ...info,
          }
        ])
      }
    }

    return input
  }
}

import { ValidationError } from "../error"
import { OptionsInfo } from "../types"

export function max<TInput extends number | string | any[]>(max: number, message?: string) {
  return (input: TInput, info: OptionsInfo) => {
    if (typeof input === "number") {
      if (input > max) {
        throw new ValidationError([
          {
            message: message || `Must be less than or equal ${max}`,
            input: input,
            ...info,
          }
        ])
      }
    } else {
      if (input.length > max) {
        throw new ValidationError([
          {
            message: message || `Must have a maximum length of ${max}`,
            input: input,
            ...info,
          }
        ])
      }
    }

    return input
  }
}

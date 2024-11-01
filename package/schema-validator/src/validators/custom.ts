import { ValidationError } from "../error"
import { OptionsInfo } from "../types"

/**
  * Accepts a callback function where if the function returns true,
  * it means that the value is valid. Otherwise, returns false and throws
  * an error.
  */
export function custom<TInput>(cb: (input: TInput) => boolean, message?: string) {
  return (input: TInput, info: OptionsInfo) => {
    if (!cb(input)) {
      throw new ValidationError([
        {
          input: input,
          message: message || `Invalid`,
          ...info
        }
      ])
    }
    return input
  }
}

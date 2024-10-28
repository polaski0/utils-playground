import { ValidationError } from "../error"

export function min<TInput extends number | string | any[]>(min: number, message?: string) {
  return (input: TInput) => {
    if (typeof input === "number") {
      if (input < min) {
        throw new ValidationError([
          {
            message: message || `Must be greater than or equal ${min}`,
            input: input,
          }
        ])
      }
    } else {
      if (input.length < min) {
        throw new ValidationError([
          {
            message: message || `Must have a minimum length of ${min}`,
            input: input,
          }
        ])
      }
    }


    return input
  }
}

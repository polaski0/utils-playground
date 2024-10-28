import { ValidationError } from "../error"

export function max<TInput extends number | string | any[]>(max: number, message?: string) {
  return (input: TInput) => {
    if (typeof input === "number") {
      if (input > max) {
        throw new ValidationError([
          {
            message: message || `Must be less than or equal ${max}`,
            input: input,
          }
        ])
      }
    } else {
      if (input.length > max) {
        throw new ValidationError([
          {
            message: message || `Must have a maximum length of ${max}`,
            input: input,
          }
        ])
      }
    }

    return input
  }
}

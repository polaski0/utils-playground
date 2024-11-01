import { ValidationError } from "../error"
import { OptionsInfo } from "../types"

export function oneOf<TInput>(selections: TInput[], message?: string) {
  return (input: TInput, info: OptionsInfo) => {
    const isIncluded = selections.includes(input)
    if (!isIncluded) {
      throw new ValidationError([
        {
          input: input,
          message: message || `"${input}" is not included on the selections: ${selections.map(val => `"${val}"`).join(", ")}.`,
          ...info
        }
      ])
    }
    return input
  }
}

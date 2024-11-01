import { ValidationError } from "../error"
import { OptionsInfo } from "../types"

export function email<TInput extends string>(message?: string) {
  return (input: TInput, info: OptionsInfo) => {
    // This is based on OWASP's validation regex repository which can be found
    // here: https://owasp.org/www-community/OWASP_Validation_Regex_Repository
    const regex = new RegExp(/^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/g);
    if (!input.match(regex)) {
      throw new ValidationError([
        {
          message: message || `Not a valid email`,
          input: input,
          ...info,
        }
      ])
    }
    return input
  }
}

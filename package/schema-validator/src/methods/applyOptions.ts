import { Issue, ValidationError } from "../error";
import { Options } from "../types";

export function applyOptions<TInput>(input: TInput, opts?: Options<TInput>) {
  const issues: Issue[] = [];
  if (opts) {
    opts.forEach((opt) => {
      try {
        input = opt(input);
      } catch (error) {
        issues.push(...(error as ValidationError).issues);
      }
    });
    if (issues.length) {
      throw new ValidationError(issues);
    }
  }
  return input;
}

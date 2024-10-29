import { Issue, ValidationError } from "../error";
import { Options, OptionsInfo } from "../types";

export function applyOptions<TInput>(input: TInput, opts: Options<TInput>, info: OptionsInfo) {
  const issues: Issue[] = [];
  opts.forEach((opt) => {
    try {
      input = opt(input, info);
    } catch (error) {
      issues.push(...(error as ValidationError).issues);
    }
  });
  if (issues.length) {
    throw new ValidationError(issues);
  }
  return input;
}

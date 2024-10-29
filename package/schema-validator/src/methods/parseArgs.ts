import { Options } from "../types";

export function parseArgs<TInput>(
  arg1?: string | Options<TInput>,
  arg2?: Options<TInput>
): {
  message: string | undefined;
  opts: Options<TInput>
} {
  let message: undefined | string = undefined
  let opts: Options<TInput> = []

  if (typeof arg1 === "string") {
    message = arg1
  }

  if (arg1 && Array.isArray(arg1)) {
    opts = arg1
  }

  if (arg2 && Array.isArray(arg2)) {
    opts = arg2
  }

  return { message: message, opts: opts }
}

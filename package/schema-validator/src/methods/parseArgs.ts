import { Options } from "../types";

export function parseArgs<TInput>(arg1?: string | Options<TInput>, arg2?: Options<TInput>): { message: string | undefined; opts: Options<TInput> | undefined } {
  if (typeof arg1 === "string") {
    return { message: arg1, opts: arg2 };
  }

  if (arg1 && Array.isArray(arg1)) {
    return { message: undefined, opts: arg1 }
  }

  return { message: undefined, opts: undefined }
}

/**
  * Used for mutating the current data.
  */
export function transform<TInput, TOutput = TInput>(cb: (input: TInput) => TOutput) {
  return (input: TInput) => {
    return cb(input)
  }
}

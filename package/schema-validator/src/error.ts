export type SchemaType =
  | "array"
  | "object"
  | "string"
  | "number"
  | "date"
  | "boolean"

export type Issue = {
  type: SchemaType
  message: string
  input: unknown
  path?: string
}

export class ValidationError extends Error {
  issues: Issue[]

  constructor(issues: Issue[]) {
    super(issues[0].message)
    this.name = "ValidationError"
    this.issues = issues
  }
}

// Convert based on the existing path.
export function format(error: ValidationError) {
  const issues = error.issues
  const output = {} as Record<string, any>

  for (const idx in issues) {
    const path = issues[idx].path
    let current = output

    if (path) {
      const keys = path.split(".")

      for (let i = 0; i < keys.length; i++) {
        if (i !== keys.length - 1) {
          current = current[keys[i]]
        } else {
          current[keys[i]] = issues[idx]
        }
      }
    } else {
      // Fix format statement for non-object schema or
      // errors without a `path`
      break
    }
  }

  return output
}

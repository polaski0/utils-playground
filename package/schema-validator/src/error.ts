export type SchemaType =
  | "array"
  | "object"
  | "string"
  | "number"

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

export function format() {
  // Convert based on the existing path.
}

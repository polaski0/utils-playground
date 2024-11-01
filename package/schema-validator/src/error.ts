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
  const output = {}

  for (const issue of issues) {
    if (issue.path) {

    }
    // console.log(issue)
  }
  console.log(issues)
}

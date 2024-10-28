// Objectives
// - Add more context to the error
//  - Path for `object` schema
//  - Schema type
//  - Input value
//  - Expected output (?)

export type Issue = {
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

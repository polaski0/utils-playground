export type SchemaType =
  | "array"
  | "object"
  | "string"
  | "number"
  | "date"
  | "boolean"

type ObjectPath = {
  type: "object"
  parent: string // Parent path
  key: string
}

type ArrayPath = {
  type: "array"
  parent: string // Parent path
  index: number
}

type PathError =
  | ObjectPath
  | ArrayPath

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

export type FormattedError<T> = {
  [K in keyof T]: {
    issues: Pick<Issue, "type" | "input" | "message">[]
  } & FormattedError<T[K]>
}

// Convert based on the existing path.
// This is only used for object schema.
export function format<TSchema extends Record<string, unknown>>(error: ValidationError): FormattedError<TSchema> {
  const issues = error.issues
  const output = {} as FormattedError<TSchema>

  for (const idx in issues) {
      console.log(issues[idx])
    const path = issues[idx].path
    let current = output

    if (path) {
      const keys = path.split(".")

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i] as keyof TSchema
        if (i !== keys.length - 1) {
          current = current[key] as FormattedError<TSchema>
        } else {
          if (!current[key]) {
            current[key] = {
              issues: []
            } as {
              issues: Pick<Issue, "type" | "input" | "message">[];
            } & FormattedError<TSchema[keyof TSchema]>
          }

          current[key].issues.push({
            type: issues[idx].type,
            message: issues[idx].message,
            input: issues[idx].input,
          })
        }
      }
    }
  }

  return output
}

import {
    common,
    array,
    boolean,
    date,
    object,
    number,
    string
} from "./locale"

import {
    replaceString
} from "./utils"

type ParseInput = {
    input: any
    params?: ExtendedIssue
}

type ParseReturn = {
    input: any
    valid: boolean
    issues: Issue[]
}

type Rule = {
    name: string
    cb: (value: any) => boolean
    message: string
    value?: unknown
}

type Options = {
    required: boolean
}

type Issue = {
    name: string
    found: unknown
    message: string
} & ExtendedIssue

type ExtendedIssue = {
    path?: string[]
    value?: unknown
}

type Result<T> = {
    valid: boolean
    value: T
    errors?: ValidationError<T>
}

abstract class Schema<Output = unknown> {
    _type: string
    _typeCheck: (v: unknown) => boolean
    _typeMessage: string

    _rules: Rule[]
    _options: Options
    _issues: Issue[]

    value?: Output

    constructor({
        type,
        check,
        message
    }: {
        type: string
        check: (v: unknown) => boolean
        message?: string
    }) {
        this._rules = []
        this._issues = []

        this._type = type
        this._typeCheck = check
        this._typeMessage = message ?? common.default

        this._options = {
            required: true
        }
    }

    _parse(args: ParseInput): ParseReturn {
        const result: ParseReturn = {
            valid: true,
            input: args.input,
            issues: []
        }

        if (!this.isType(args.input)) {
            if (args.input) {
                this._addIssue({
                    message: this._typeMessage,
                    name: "invalid_type",
                    found: args.input,
                    ...args.params
                })
            } else {
                this._addIssue({
                    message: common.required,
                    name: "required",
                    found: args.input,
                    ...args.params
                })
            }
        } else {
            for (const rule of this._rules) {
                if (!rule.cb(args.input)) {
                    const _issue = {
                        message: rule.message,
                        name: rule.name,
                        found: args.input,
                        ...args.params
                    }

                    if (rule.value) {
                        _issue.value = rule.value
                    }

                    this._addIssue(_issue)
                }
            }
        }

        result.issues = this._issues
        if (result.issues.length) {
            result.valid = false
        }
        return result
    }

    isType(input: unknown) {
        if (!input) {
            if (!this._options.required && input === null) return true
            if (!this._options.required && input === undefined) return true
        }
        return this._typeCheck(input)
    }

    validate(input?: unknown): Result<Output> {
        this.value = input as Output
        const result = this._parse({ input })
        const returnValue: Result<Output> = {
            valid: result.valid,
            value: result.input,
        }

        if (!result.valid) {
            returnValue.errors = new ValidationError<Output>(result)
        }

        return returnValue
    }

    optional() {
        this._options.required = false
        return this
    }

    custom(
        cb: (v: Output) => boolean,
        message: string
    ) {
        return this._addRule({
            name: "custom_error",
            cb: cb,
            message: message
        })
    }

    _addIssue(issue: Issue) {
        const _issue = issue

        if (_issue.value) {
            _issue.message = replaceString(
                _issue.message,
                new RegExp(`{${issue.name}}`),
                _issue.value.toString()
            )
        }

        this._issues.push(_issue)
    }

    _addRule(rule: Rule) {
        this._rules.push(rule)
        return this
    }
}

type ObjectShape = Record<string, Schema>

type Infer<T extends Schema> = T extends Schema<infer I> ? I : never

type ObjectOutput<T> = T extends ObjectShape ? {
    [K in keyof T]: Infer<T[K]>
} : never

class ObjectSchema<T extends ObjectShape, U = ObjectOutput<T>> extends Schema<U> {
    _schema: T
    _path: string[]

    constructor(schema: T) {
        super({
            type: "object",
            check: (v: unknown) => typeof v === "object" && v !== null && !(v instanceof Array),
            message: object.default,
        })
        this._schema = schema
        this._path = []
    }

    _parse(args: ParseInput): ParseReturn {
        const _value = args.input
        const result: ParseReturn = {
            input: _value,
            valid: true,
            issues: []
        }

        if (!this.isType(_value)) {
            this._addIssue({
                message: common.default,
                name: "invalid_type",
                found: args.input,
            })
        } else if (this._options.required || _value) {
            // Check its own rules
            for (const rule of this._rules) {
                if (!rule.cb(_value)) {
                    const _issue = {
                        message: rule.message,
                        name: rule.name,
                        found: _value,
                        ...args.params
                    }

                    if (rule.value) {
                        _issue.value = rule.value
                    }

                    this._addIssue(_issue)
                }
            }

            // Check schema rules
            for (const key in this._schema) {
                const _schema = this._schema[key]
                const _result = _schema._parse({
                    input: _value ? _value[key] : _value,
                    params: {
                        path: [key],
                    }
                })

                if (_schema instanceof ObjectSchema) {
                    this._path.push(key)
                }

                if (!_result.valid) {
                    for (const issue of _result.issues) {
                        const path = issue.path
                            ? [...this._path, ...issue.path]
                            : [key]
                        this._addIssue({ ...issue, path })
                    }
                }
            }
        }

        result.issues = this._issues
        if (result.issues.length) {
            result.valid = false
        }
        return result
    }
}

class ArraySchema<T extends Schema> extends Schema<Array<T>> {
    _schema: T

    constructor(schema: T) {
        super({
            type: "array",
            check: (v: unknown) => v instanceof Array,
            message: array.default,
        })
        this._schema = schema
    }

    _parse(args: ParseInput): ParseReturn {
        const _value = args.input
        const result: ParseReturn = {
            input: _value,
            valid: true,
            issues: []
        }

        if (!this.isType(_value)) {
            this._addIssue({
                message: array.default,
                name: "invalid_type",
                found: args.input,
            })
        } else if (this._options.required || _value) {
            // Check its own rules
            for (const rule of this._rules) {
                if (!rule.cb(_value)) {
                    const _issue = {
                        message: rule.message,
                        name: rule.name,
                        found: _value,
                        ...args.params
                    }

                    if (rule.value) {
                        _issue.value = rule.value
                    }

                    this._addIssue(_issue)
                }
            }

            // Check the schema of inserted values
            for (const value of _value) {
                const _result = this._schema._parse({
                    input: value
                })

                if (!_result.valid) {
                    this._issues = _result.issues
                }
            }
        }

        result.issues = this._issues
        if (result.issues.length) {
            result.valid = false
        }
        return result
    }

    min(min: number, message?: string) {
        return this._addRule({
            name: "min",
            cb: (v: unknown[]) => v.length >= min,
            message: message ?? array.min,
            value: min
        })
    }

    max(max: number, message?: string) {
        return this._addRule({
            name: "max",
            cb: (v: unknown[]) => v.length <= max,
            message: message ?? array.max,
            value: max
        })
    }
}

class StringSchema extends Schema<string> {
    constructor() {
        super({
            type: "string",
            check: (v: unknown) => typeof v === "string",
            message: string.default,
        })
    }

    min(min: number, message?: string) {
        return this._addRule({
            name: "min",
            cb: (v: string) => v.length >= min,
            message: message ?? string.min,
            value: min
        })
    }

    max(max: number, message?: string) {
        return this._addRule({
            name: "max",
            cb: (v: string) => v.length <= max,
            message: message ?? string.max,
            value: max
        })
    }
}

class NumberSchema extends Schema<number> {
    constructor() {
        super({
            type: "number",
            check: (v: unknown) => typeof v === "number",
            message: number.default,
        })
    }
}

class BooleanSchema extends Schema<Boolean> {
    constructor() {
        super({
            type: "boolean",
            check: (v: unknown) => v instanceof Boolean,
            message: boolean.default,
        })
    }
}

class DateSchema extends Schema<Date> {
    constructor() {
        super({
            type: "date",
            check: (v: unknown) => v instanceof Date,
            message: date.default,
        })
    }
}

// Errors
type RecursiveErrorFormatting<T> = T extends ObjectShape ? {
    [K in keyof T]?: FormattedError<T[K]>
} : T extends object ? {
    [K in keyof T]?: FormattedError<T[K]>
} : unknown

type FormattedError<T> = {
    _errors: ErrorFormat[]
} & RecursiveErrorFormatting<T>

type ErrorFormat = {
    name: string
    message: string
}

class ValidationError<T = any> {
    _result: ParseReturn
    constructor(result: ParseReturn) {
        this._result = result
    }

    getErrors(): Issue[] {
        return this._result.issues
    }

    format(): FormattedError<T> {
        const formatted = {
            _errors: []
        } as FormattedError<T>
        const issues = this._result.issues

        for (const issue of issues) {
            let currObject: any = formatted
            if (!issue.path) {
                currObject._errors.push({
                    name: issue.name,
                    message: issue.message
                })
                continue
            }

            for (let i = 0; i < issue.path.length; i++) {
                const key = issue.path[i] as keyof T
                if (!currObject[key]) {
                    currObject[key] = {
                        _errors: []
                    }
                }

                currObject = currObject[key]
                if (i === issue.path.length - 1) {
                    currObject._errors.push({
                        name: issue.name,
                        message: issue.message
                    })
                }
            }
        }

        return formatted
    }
}

export const v = {
    object: <T>(schema: T extends ObjectShape ? T : never) => new ObjectSchema(schema),
    array: <T>(schemas: T extends Schema ? T : never) => new ArraySchema(schemas),
    string: () => new StringSchema(),
    number: () => new NumberSchema(),
    date: () => new DateSchema(),
    boolean: () => new BooleanSchema(),
    ValidationError,
}

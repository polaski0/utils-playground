type ParseInput = {
    input: any;
    params?: Record<any, any>; // Fix params
}

type ParseReturn = {
    input: unknown;
    valid: boolean;
    issues: Issue[];
}

type Rule = {
    name: string;
    cb: (value: any) => boolean;
    message: string;
}

type Options = {
    required: boolean;
}

type Issue = {
    name: string;
    found: unknown;
    message: string;
    path?: string[];
}


abstract class Schema<Output = unknown> {
    _type: string;
    _typeCheck: (v: unknown) => boolean;

    _rules: Rule[];
    _options: Options;
    _issues: Issue[];

    constructor({
        type,
        check
    }: {
        type: string,
        check: (v: unknown) => boolean;
    }) {
        this._rules = []
        this._issues = []
        this._type = type
        this._typeCheck = check
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

        // Fix pushing of issue to determine if wrong type or is missing required value
        if (!this.isType(args.input)) {
            this._addIssue({
                message: `The type supplied is invalid.`,
                name: "invalid_type",
                found: args.input,
                ...args.params
            })
        } else {
            for (const rule of this._rules) {
                if (!rule.cb(args.input)) {
                    this._addIssue({
                        message: rule.message,
                        name: rule.name,
                        found: args.input,
                        ...args.params
                    })
                }
            }
        }

        result.issues = this._issues
        if (result.issues.length) {
            result.valid = false
        }
        return result;
    }

    isType(input: unknown) {
        if (!input) {
            if (!this._options.required && input === null) return true;
            if (!this._options.required && input === undefined) return true;
        }
        return this._typeCheck(input)
    }

    validate(input?: unknown) {
        const result = this._parse({ input })
        if (!result.valid) {
            throw new ValidationError(result)
        }
        return result;
    }

    optional() {
        this._options.required = false;
        return this;
    }

    _addIssue(issue: Issue) {
        this._issues.push(issue);
    }

    _addRule(rule: Rule) {
        this._rules.push(rule);
        return this;
    }
}

class ObjectSchema<T extends Record<any, Schema<T>>> extends Schema<T> {
    _schema: T;
    _path: string[];

    constructor(schema: T) {
        super({
            type: "object",
            check: (v: unknown) => typeof v === "object"
        });
        this._schema = schema;
        this._path = [];
    }

    _parse(args: ParseInput): ParseReturn {
        const _value = args.input;
        const result: ParseReturn = {
            input: _value,
            valid: true,
            issues: []
        }

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

                if (!this.isType(_value ? _value[key] : _value)) {
                    this._addIssue({
                        message: `The object supplied is invalid`,
                        name: "invalid_type",
                        found: args.input,
                        path: this._path,
                    })
                }
            }

            if (!_result.valid) {
                for (const issue of _result.issues) {
                    const path = issue.path ? [...this._path, ...issue.path] : [key]
                    this._addIssue({ ...issue, path })
                }
            }
        }

        result.issues = this._issues
        if (result.issues.length) {
            result.valid = false
        }
        return result
    };
}

class StringSchema extends Schema<string> {
    constructor() {
        super({
            type: "string",
            check: (v: unknown) => typeof v === "string"
        });
    }

    min(min: number) {
        return this._addRule({
            name: "min",
            cb: (v: unknown) => typeof v === "string" && v.length >= min,
            message: `Must have a minimum length of ${min}`
        })
    }
}

class ValidationError {
    _result: ParseReturn
    constructor(result: ParseReturn) {
        this._result = result
    }
}

export const v = {
    object: (schema: Record<any, Schema<any>>) => new ObjectSchema(schema),
    string: () => new StringSchema(),
    ValidationError,
}

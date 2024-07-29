type ParseInput = {
    input: any;
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
    path?: string[];
    found: unknown;
    message: string;
}


abstract class Schema<Output = unknown> {
    _type: string;
    _typeCheck: (v: unknown) => boolean;

    _rules: Rule[];
    _options: Options;
    _issues: Issue[];

    // Fix _parse abstract method due to following reasons:
    //  -   Needs to call the _typeCheck method in all _parse method, causing
    //      redundancy and more error prone when being extended
    //  -   Each _parse method that does not require recursive parsing capability
    //      such as string, number, etc. will redundantly call the same function
    //      that goes through the _rules array just to check the method
    //
    //  In short, create a better function that can be used globally without the subclasses
    //  needing to repeat the same methods over and over again
    // abstract _parse(args: ParseInput): ParseReturn

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

        if (!this.isType(args.input)) {
            this._addIssue({
                message: `Invalid input`,
                name: "invalid type",
                found: args.input,
            })
        }

        for (const rule of this._rules) {
            if (!rule.cb(args.input)) {
                this._addIssue({
                    message: rule.message,
                    name: rule.name,
                    found: args.input,
                })
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
        if (!this._issues) {
            this._issues = [];
        }

        this._issues.push(issue);
        return this;
    }

    _addRule(rule: Rule) {
        this._rules.push(rule);
        return this;
    }
}

class ObjectSchema<T extends Record<any, Schema<T>>> extends Schema<T> {
    _schema: T;

    constructor(schema: T) {
        super({
            type: "object",
            check: (v: unknown) => typeof v === "object"
        });
        this._schema = schema;
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
            const _result = _schema._parse({ input: _value ? _value[key] : _value })

            if (!_result.valid) {
                for (const issue of _result.issues) {
                    this._addIssue(issue)
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

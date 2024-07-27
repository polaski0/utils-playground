type ParseInput = {
    input: unknown;
}

type ParseReturn = {
    input: unknown;
    valid: boolean;
    issues?: Issue[];
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


abstract class Schema<Input, Output> {
    _rules: Rule[];
    _options: Options;
    _issues?: Issue[];

    abstract _parse(args: ParseInput): ParseReturn

    constructor() {
        this._rules = []
        this._options = {
            required: true
        }

        this.required()
    }

    parse(input?: unknown) {
        const result = this._parse({ input })
        return result
    }

    required() {
        this._options.required = true;
        return this._addRule({
            name: "required",
            cb: (value) => value !== undefined && value !== null && value !== "",
            message: "Required",
        });
    }

    optional() {
        this._options.required = false;
        return this._removeRule("required")
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

    _removeRule(name: string) {
        const index = this._rules.findIndex(rule => rule.name === name);
        if (index !== -1) {
            this._rules.splice(index, 1);
        }
        return this;
    }
}

class ObjectSchema<T extends Record<any, any>> extends Schema<T, any> {
    _schema: T;

    constructor(schema: T) {
        super();
        this._schema = schema;
    }

    _parse(args: ParseInput): ParseReturn {
        const result: ParseReturn = {
            input: args,
            valid: true
        }

        return result
    };
}

class StringSchema extends Schema<string, any> {
    _parse(args: ParseInput): ParseReturn {
        const result: ParseReturn = {
            input: args,
            valid: true
        };

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
        if (result.issues) {
            result.valid = false
        }

        return result;
    };
}

export const v = {
    object: (schema: Record<any, any>) => new ObjectSchema(schema),
    string: () => new StringSchema()
}

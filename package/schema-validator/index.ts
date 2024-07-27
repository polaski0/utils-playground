import {
    SchemaV,
    StringV,
    NumberV,
    ObjectV,
    BooleanV,
    ArrayV,
    DateV
} from "./src";

export const s = {
    string: () => new StringV(),
    number: () => new NumberV(),
    object: (schema: Record<string | number | symbol, SchemaV>) => new ObjectV(schema),
    boolean: () => new BooleanV(),
    array: () => new ArrayV(),
    date: () => new DateV(),
};

// -- DO NOT MODIFY ABOVE THE LINE --

export type Options = {
    required: boolean,
};

export type Rule = {
    name: string,
    cb: (value: any) => boolean,
    message: string,
    value?: unknown,
};

export type Value = string | number | Record<any, any> | undefined | null;

export type Result<T> = {
    valid: boolean,
    output?: T,
    issues?: Issue[],
}

export type Issue = {
    type: string,
    input: unknown,
    expected: unknown,
    received: unknown,
    message: string,
    path?: string[] | null
}

export class SchemaVal {
    _rules: Rule[];
    _options: Options;
    _issues: Issue[] | undefined;

    constructor() {
        this._options = {
            required: true,
        };
        this._rules = [];
        this._issues = [];

        this.required()
    }

    rule(
        name: string,
        cb: (value: unknown) => boolean,
        opts: {
            message: string,
            value?: unknown
        },
    ) {
        const index = this._rules.findIndex((rule) => rule.name === name)
        if (index === -1) {
            this._rules.push({
                name,
                cb,
                ...opts
            });
        } else {
            this._rules[index] = {
                name,
                cb,
                ...opts
            };
        }

        return this;
    }

    required(message?: string) {
        this._options.required = true;
        return this.rule(
            "required",
            (value) => value !== undefined && value !== null && value !== "",
            {
                message: message ?? "Required"
            }
        );
    }

    optional() {
        this._options.required = false;
        this._removeRule("required");
        return this;
    }

    validate<T>(value?: T, params?: { path: string[] }): Result<T> {
        const _result: Result<T> = {
            valid: true,
            output: value,
            issues: []
        };

        if (!this._isEmpty(value) || this._options.required) {
            for (const rule of this._rules) {
                if (!rule.cb(value)) {
                    _result.valid = false;
                    this._createError(rule.name, value, rule.value, rule.message, params)
                }
            }
        }

        _result.issues = this._issues
        return _result;
    }

    _isEmpty<T>(value: T) {
        if (value instanceof Array) {
            return value.length > 0 ? false : true;
        }

        if (typeof value === "object" && value) {
            return Object.entries(value).length > 0 ? false : true;
        }

        return !(value !== undefined && value !== null && value !== "");
    }

    _createError(
        type: string,
        input: unknown,
        expected: unknown,
        message: string,
        params?: {
            path: string[]
        }
    ) {
        const _issue: Issue = {
            type,
            input,
            expected,
            received: input,
            message,
            ...params,
        }

        if (!this._issues) {
            this._issues = []
        }

        this._issues.push(_issue)
        return _issue;
    }

    _removeRule(name: string) {
        const index = this._rules.findIndex((r) => r.name === name);
        if (index !== -1) {
            this._rules.splice(index, 1);
        }
    }
}

type ObjectSchema = Record<string | number | symbol, SchemaVal>;

export class ObjectVal extends SchemaVal {
    _schema: ObjectSchema;
    _path: string[];

    constructor(schema: ObjectSchema) {
        super();
        this._schema = schema;
        this._path = []
    }

    validate<T extends Record<any, any>>(value: T): Result<T> {
        const _result: Result<T> = {
            valid: true,
            output: value,
        };

        if (!this._isEmpty(value) || this._options.required) {
            for (const key in this._schema) {
                const _schema = this._schema[key];
                const result = _schema.validate(value ? value[key] : value, { path: [key] });

                if (_schema instanceof ObjectVal) {
                    this._path.push(key)
                }

                if (!result.valid && result.issues) {
                    if (!this._issues) {
                        this._issues = [];
                    }

                    _result.valid = false;
                    for (const issue of result.issues) {
                        const path = issue.path ? [...this._path, ...issue.path] : []
                        this._issues.push({ ...issue, path })
                    }
                }
            }
        }

        _result.issues = this._issues
        return _result
    }
}

export class StringVal extends SchemaVal {
    constructor() {
        super();
        this.rule(
            "string",
            (value) => typeof value === "string",
            {
                message: "Must be type of string"
            }
        );
    }

    min(min: number, message?: string) {
        return this.rule(
            "min",
            (value) => typeof value === "string" && value.length >= min,
            {
                message: message ?? `This string must be at least ${min} characters long.`,
                value: min,
            }
        );
    }

    max(max: number, message?: string) {
        return this.rule(
            "max",
            (value) => typeof value === "string" && value.length <= max,
            {
                message: message ?? `This string cannot be longer than ${max} characters.`,
                value: max,
            }
        );
    }
}

export const v = {
    object: (schema: ObjectSchema) => new ObjectVal(schema),
    string: () => new StringVal(),
};

import { TIssue, TOptions, TResult, TRule } from "../types";

export class SchemaV {
    _rules: TRule[];
    _options: TOptions;
    _issues: TIssue[] | undefined;

    constructor() {
        this._options = {
            required: true,
        };
        this._rules = [];
        this._issues = [];

        this.required()
    }

    rule(name: string, cb: (value: any) => boolean, opts: { message: string, value?: unknown }) {
        this._rules.push({ name, cb, ...opts });
        return this;
    }

    required() {
        this._options.required = true;
        return this.rule(
            "required",
            (v) => v !== undefined && v !== null && v !== "",
            {
                message: "Required"
            }
        );
    }

    optional() {
        this._options.required = false;
        this._removeRule("required");
        return this;
    }

    validate<T>(value?: T): TResult<T> {
        const _result: TResult<T> = {
            valid: true,
            output: value
        };

        if (!this._isEmpty(value) || this._options.required) {
            for (const rule of this._rules) {
                if (!rule.cb(value)) {
                    _result.valid = false;
                    this._createError(rule.name, value, rule.value, rule.message)
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

    _createError(type: string, input: unknown, expected: unknown, message: string) {
        const _issue: TIssue = {
            type,
            input,
            expected,
            received: input,
            message,
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

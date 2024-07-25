import { TOptions, TRule, TValidationError, TValue } from "../types";
import { ValidationError } from "../types/errors";

export class SchemaV {
    _rules: TRule[];
    _options: TOptions;
    errors: TValidationError[];
    isValid: boolean;

    constructor() {
        this._options = {
            required: true,
        };
        this._rules = [];
        this.errors = [];
        this.isValid = true;

        // Initialize default rules
        if (this._options.required) {
            this.rule(
                "Required",
                (value: any) => value !== undefined && value !== null && value !== "",
            );
        }
    }

    rule(name: string, cb: (value: any) => boolean, opts = {}) {
        this._rules.push({ name, cb, ...opts });
        return this;
    }

    optional() {
        this._options.required = false;
        return this
    }

    validate<T extends TValue>(value?: T) {
        if (!this._isEmpty(value) || this._options.required) {
            this._rules.forEach((rule) => {
                const ok = rule.cb(value);
                if (!ok) {
                    this.isValid = false;
                    this._addError(new ValidationError(rule.name, value));
                }
            });
        }

        return this;
    }

    /** Push error to _errors array */
    _addError(err: TValidationError | TValidationError[]) {
        if (err instanceof Array) {
            this.errors.push(...err);
        } else {
            this.errors.push(err);
        }
    }

    _isEmpty<T>(value: T) {
        if (value instanceof Array) {
            return value.length > 0 ? false : true;
        }

        if (typeof value === "object" && value !== null) {
            return Object.entries(value).length > 0 ? false : true;
        }

        return !(value !== undefined && value !== null && value !== "");
    }
}

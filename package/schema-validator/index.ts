type TOptions = {
    required: boolean;
};

type TRule = {
    name: string;
    cb: (value: any) => boolean;
};

type TValue = string | number | Record<any, any> | undefined | null;

type TValidationError = ValidationError;

class ValidationError extends Error {
    name: string;
    value: any;
    constructor(name: string, value: any) {
        super(name);
        this.name = name;
        this.value = value;
    }
}

class BaseV {
    _rules: TRule[];
    _options: TOptions;
    errors: ValidationError[];
    isValid: boolean;

    constructor() {
        this._options = {
            required: true,
        };
        this._rules = [];
        this.errors = [];
        this.isValid = true;

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

class StringV extends BaseV {
    constructor() {
        super();
        this.rule("String", (value) => typeof value === "string");
    }

    min(num: number) {
        return this.rule(
            "Min",
            (value) => typeof value === "string" && value.length >= num,
        );
    }

    max(num: number) {
        return this.rule(
            "Max",
            (value) => typeof value === "string" && value.length <= num,
        );
    }
}

class NumberV extends BaseV {
    constructor() {
        super();
        this.rule("Number", (value) => typeof value === "number");
    }

    min(num: number) {
        return this.rule(
            "Min",
            (value) => typeof value === "number" && value >= num,
        );
    }

    max(num: number) {
        return this.rule(
            "Min",
            (value) => typeof value === "number" && value <= num,
        );
    }
}

type TObjectSchema = Record<string, BaseV>;

class ObjectV extends BaseV {
    _schema: TObjectSchema;

    constructor(schema: TObjectSchema) {
        super();
        this._schema = schema;
    }

    /** Fix recursive validation of object */
    validate<T extends Record<any, any>>(value: T): this {
        if (this._options.required && typeof value !== "object") {
            this.isValid = false;
            this._addError(new ValidationError("Invalid Object", value));
        }

        if (value) {
            for (const key in this._schema) {
                if (this._schema[key]._options.required && !value[key]) {
                    this.isValid = false
                    this._addError(new ValidationError("Required", value[key]));
                    continue;
                }

                const _b = this._schema[key].validate((value as TObjectSchema)[key]);
                if (!_b.isValid) {
                    this._addError(_b.errors);
                    this.isValid = false;
                }
            }
        }

        return this;
    }
}

export const s = {
    string: () => new StringV(),
    number: () => new NumberV(),
    object: (schema: Record<string, BaseV>) => new ObjectV(schema),
};


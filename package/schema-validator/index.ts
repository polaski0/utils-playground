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
    issues: Issue[],
}

export type Issue = {
    type: string,
    input: unknown,
    expected: unknown,
    received: unknown,
    message: string,
    path?: string[] | null
    _key?: string;
}

abstract class SchemaVal {
    _rules: Rule[];
    _options: Options;
    _issues: Issue[];
    _typeCheck: (v: unknown) => boolean;
    _type: string;

    constructor({
        type,
        check,
    }: {
        type: string;
        check: (v: unknown) => boolean;
    }) {
        this._rules = [];
        this._issues = [];
        this._typeCheck = check
        this._type = type;
        this._options = {
            required: true,
        };

        // Remove
        // this.required()
    }

    abstract _parse(value: {
        data: any;
        params?: {
            path?: string[]
        }
    }
    ): Result<unknown>

    // Fix the way of checking the type
    isType(v: unknown) {
        if (v === null) {
            if (this._options.required) return false;
        }

        return this._typeCheck(v)
    }

    validate(data: unknown) {
        const result = this._parse({ data })
        if (!result.valid) {
            throw new ValError(result)
        }
        return result
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

    optional() {
        this._options.required = false;
        return this;
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
            path?: string[],
            _key?: string,
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

type ObjectSchema = Record<any, SchemaVal>;

export class ObjectVal extends SchemaVal {
    _schema: ObjectSchema;
    _path: string[];

    constructor(schema: ObjectSchema) {
        super({
            type: "object",
            check: (v) => typeof v === "object"
        });

        this._schema = schema;
        this._path = []
    }

    _parse(value:
        {
            data: any;
            params: {
                path?: string[],
            }
        }
    ): Result<Record<any, any>> {
        const _result: Result<Record<any, any>> = {
            valid: true,
            output: value.data,
            issues: []
        };

        if (!this._isEmpty(value)) {
            for (const key in this._schema) {
                const _schema = this._schema[key];
                const _data = value.data ? value.data[key] : value.data
                if (!_schema.isType(_data)) {
                    this._createError("required", value.data, _schema._type, `Required`, { path: [key], _key: key })
                }

                const result = _schema._parse({ data: _data, params: { path: [key] } });

                if (_schema instanceof ObjectVal) {
                    this._path.push(key);
                }

                if (!result.valid && result.issues) {
                    if (!this._issues) {
                        this._issues = [];
                    }

                    for (const issue of result.issues) {
                        const path = issue.path ? [...this._path, ...issue.path] : [];
                        this._issues.push({ ...issue, path });
                    }
                }
            }
        }

        _result.issues = this._issues
        if (_result.issues.length) {
            _result.valid = false;
        }
        return _result
    }
}

export class StringVal extends SchemaVal {
    constructor() {
        super({
            type: "string",
            check: (v) => typeof v === "string",
        });
    }

    _parse(value: {
        data: any;
        params: {
            path?: string[]
        }
    }
    ): Result<string> {
        const _result: Result<string> = {
            valid: true,
            output: value.data,
            issues: []
        };

        if (!this.isType(value.data)) {
            this._createError("required", value.data, this._type, `Required`)
        }

        for (const rule of this._rules) {
            if (!rule.cb(value.data)) {
                this._createError(rule.name, value.data, rule.value, rule.message, value.params)
            }
        }

        _result.issues = this._issues
        if (_result.issues.length) {
            _result.valid = false;
        }
        return _result;
    }
}

export class ValError<Input> {
    _result: Result<Input>
    constructor(result: Result<Input>) {
        this._result = result
    }

    format() {
        const formatted: Record<string, any> = {}

        for (const issue of this._result.issues) {
            if (!issue.path) {
                continue;
            }

            let currObject = formatted
            for (const key of issue.path) {
                if (!currObject[key]) {
                    currObject[key] = {
                        _errors: []
                    }
                }
                currObject = currObject[key]
            }

            if (currObject._errors) {
                currObject._errors.push({
                    message: issue.message,
                })
            }
        }

        return formatted;
    }
}

export const v = {
    object: (schema: ObjectSchema) => new ObjectVal(schema),
    string: () => new StringVal(),
    ValError,
};

// export type Options = {
//     required: boolean,
// };
//
// export type Rule = {
//     name: string,
//     cb: (value: any) => boolean,
//     message: string,
//     value?: unknown,
// };
//
// export type Value = string | number | Record<any, any> | undefined | null;
//
// export type Result<T> = {
//     valid: boolean,
//     output?: T,
//     issues?: Issue[],
// }
//
// export type Issue = {
//     type: string,
//     input: unknown,
//     expected: unknown,
//     received: unknown,
//     message: string,
//     path?: string[] | null
// }
//
// abstract class SchemaVal {
//     _rules: Rule[];
//     _options: Options;
//     _issues: Issue[] | undefined;
//
//     constructor() {
//         this._options = {
//             required: true,
//         };
//         this._rules = [];
//         this._issues = [];
//
//         this.required()
//     }
//
//     abstract _parse(value: unknown): Result<unknown>
//
//     validate<T>(value?: T, params?: { path: string[] }) {
//         const _result: Result<T> = {
//             valid: true,
//             output: value,
//             issues: []
//         };
//
//         if (!this._isEmpty(value) || this._options.required) {
//             for (const rule of this._rules) {
//                 if (!rule.cb(value)) {
//                     _result.valid = false;
//                     this._createError(rule.name, value, rule.value, rule.message, params)
//                 }
//             }
//         }
//
//         _result.issues = this._issues
//         return _result;
//     }
//
//     rule(
//         name: string,
//         cb: (value: unknown) => boolean,
//         opts: {
//             message: string,
//             value?: unknown
//         },
//     ) {
//         const index = this._rules.findIndex((rule) => rule.name === name)
//         if (index === -1) {
//             this._rules.push({
//                 name,
//                 cb,
//                 ...opts
//             });
//         } else {
//             this._rules[index] = {
//                 name,
//                 cb,
//                 ...opts
//             };
//         }
//
//         return this;
//     }
//
//     required(message?: string) {
//         this._options.required = true;
//         return this.rule(
//             "required",
//             (value) => value !== undefined && value !== null && value !== "",
//             {
//                 message: message ?? "Required"
//             }
//         );
//     }
//
//     optional() {
//         this._options.required = false;
//         this._removeRule("required");
//         return this;
//     }
//
//     _isEmpty<T>(value: T) {
//         if (value instanceof Array) {
//             return value.length > 0 ? false : true;
//         }
//
//         if (typeof value === "object" && value) {
//             return Object.entries(value).length > 0 ? false : true;
//         }
//
//         return !(value !== undefined && value !== null && value !== "");
//     }
//
//     _createError(
//         type: string,
//         input: unknown,
//         expected: unknown,
//         message: string,
//         params?: {
//             path: string[]
//         }
//     ) {
//         const _issue: Issue = {
//             type,
//             input,
//             expected,
//             received: input,
//             message,
//             ...params,
//         }
//
//         if (!this._issues) {
//             this._issues = []
//         }
//
//         this._issues.push(_issue)
//         return _issue;
//     }
//
//     _removeRule(name: string) {
//         const index = this._rules.findIndex((r) => r.name === name);
//         if (index !== -1) {
//             this._rules.splice(index, 1);
//         }
//     }
// }
//
// type ObjectSchema = Record<string | number | symbol, SchemaVal>;
//
// export class ObjectVal extends SchemaVal {
//     _schema: ObjectSchema;
//     _path: string[];
//
//     constructor(schema: ObjectSchema) {
//         super();
//         this._schema = schema;
//         this._path = []
//     }
//
//     _parse(value: unknown) {
//         throw new Error("Method not implemented.");
//     }
//
//     validate<T extends Record<any, any>>(value: T) {
//         const _result: Result<T> = {
//             valid: true,
//             output: value,
//         };
//
//         if (!this._isEmpty(value) || this._options.required) {
//             for (const key in this._schema) {
//                 const _schema = this._schema[key];
//                 const result = _schema.validate(value ? value[key] : value, { path: [key] });
//
//                 if (_schema instanceof ObjectVal) {
//                     this._path.push(key)
//                 }
//
//                 if (!result.valid && result.issues) {
//                     if (!this._issues) {
//                         this._issues = [];
//                     }
//
//                     _result.valid = false;
//                     for (const issue of result.issues) {
//                         const path = issue.path ? [...this._path, ...issue.path] : []
//                         this._issues.push({ ...issue, path })
//                     }
//                 }
//             }
//         }
//
//         _result.issues = this._issues
//
//         // Fix returning of Errors
//         if (_result.issues) {
//             const err = new ValError(_result)
//             const formattedErr = err.format()
//             console.log("Formatted", formattedErr)
//
//             // for (const key in formattedErr) {
//             //     // @ts-ignore
//             //     console.log(key, formattedErr[key])
//             // }
//         }
//
//         return _result
//     }
// }
//
// export class StringVal extends SchemaVal {
//     constructor() {
//         super();
//         this.rule(
//             "string",
//             (value) => typeof value === "string",
//             {
//                 message: "Must be type of string"
//             }
//         );
//     }
//
//     _parse(value: unknown) {
//         throw new Error("Method not implemented.");
//     }
// }
//
// export class ValError<Input> {
//     _result: Result<Input>
//     constructor(result: Result<Input>) {
//         this._result = result
//     }
//
//     format() {
//         const formatted: Record<string, any> = {}
//
//         if (!this._result.issues) {
//             return this._result;
//         }
//
//         for (const issue of this._result.issues) {
//             console.log("Issue", issue)
//             if (!issue.path) {
//                 continue;
//             }
//
//             let currObject = formatted
//             for (const key of issue.path) {
//                 if (!currObject[key]) {
//                     currObject[key] = {
//                         _errors: []
//                     }
//                 }
//                 currObject = currObject[key]
//             }
//
//             currObject._errors.push({
//                 message: issue.message,
//             })
//         }
//
//         return formatted;
//     }
// }
//
// export const v = {
//     object: (schema: ObjectSchema) => new ObjectVal(schema),
//     string: () => new StringVal(),
// };

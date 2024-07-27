import { TResult } from "../types";
import { SchemaV } from "./schema";

type TObjectSchema = Record<string | number | symbol, SchemaV>;

export class ObjectV extends SchemaV {
    _schema: TObjectSchema;

    constructor(schema: TObjectSchema) {
        super();
        this._schema = schema;
    }

    validate<T extends Record<any, any>>(value?: T): TResult<T> {
        const _result: TResult<T> = {
            valid: true,
            output: value
        };

        if (!this._isEmpty(value) || this._options.required) {
            for (const key in this._schema) {
                const _schema = this._schema[key];

                const result = _schema.validate(value ? value[key] : value);
                if (!result.valid && result.issues) {
                    if (!this._issues) {
                        this._issues = [];
                    }

                    _result.valid = false;
                    for (const issue of result.issues) {
                        this._issues.push(issue)
                    }
                }
            }
        }

        _result.issues = this._issues
        return _result
    }
}

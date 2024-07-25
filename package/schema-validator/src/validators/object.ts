import { ValidationError } from "../types/errors";
import { SchemaV } from "./schema";

type TObjectSchema = Record<string, SchemaV>;

export class ObjectV extends SchemaV {
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

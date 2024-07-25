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
    boolean: () => new BooleanV(), // Not yet implemented
    array: () => new ArrayV(), // Not yet implemented
    date: () => new DateV(), // Not yet implemented
};

// -- DO NOT MODIFY ABOVE THE LINE --

// type ValidationResult<T> = {
//     valid: boolean,
//     output: T | undefined,
//     issues?: Issue[],
// }
// 
// type Issue = {
//     type: string,
//     input: unknown,
//     expected: unknown,
//     received: unknown,
//     message: string,
// }
// 
// type Rule = {
//     name: string,
//     cb: (value: unknown) => boolean;
//     message: string;
// }
// 
// type Options = {
//     required: boolean;
// }
// 
// class BaseSchema {
//     _rules: Rule[];
//     _options: Options;
//     _issues: Issue[] | undefined
// 
//     constructor() {
//         this._rules = [];
//         this._options = {
//             required: true
//         };
// 
//         this.required()
//     }
// 
//     validate<T>(value?: T): ValidationResult<T> {
//         const _result: ValidationResult<T> = {
//             valid: true,
//             output: value
//         };
// 
//         if (value || this._options.required) {
//             for (const rule of this._rules) {
//                 if (!rule.cb(value)) {
//                     _result.valid = false;
//                     this._createError(rule.name, value, undefined, rule.message)
//                 }
//             }
//         }
// 
//         _result.issues = this._issues
//         return _result;
//     }
// 
//     required() {
//         this._options.required = true;
//         return this.rule(
//             "required",
//             (v) => v !== undefined && v !== null && v !== "",
//             {
//                 message: "Required"
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
//     rule(name: string, cb: (value: any) => boolean, opts: { message: string }) {
//         this._rules.push({ name, cb, ...opts });
//         return this;
//     }
// 
//     _createError(type: string, input: unknown, expected: unknown, message: string) {
//         const _issue: Issue = {
//             type,
//             input,
//             expected,
//             received: input,
//             message,
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
// class ObjectSchema<T> extends BaseSchema {
//     _schema: T
//     constructor(schema: T) {
//         super();
//         this.rule(
//             "object",
//             (v) => typeof v === "object",
//             {
//                 message: "Must be an object",
//             }
//         );
// 
//         this._schema = schema
//     }
// 
//     validate<T>(value?: T): ValidationResult<T> {
//         const _result: ValidationResult<T> = {
//             valid: true,
//             output: value,
//         }
// 
//         if (typeof value !== "object") {
//             _result.valid = false;
//         }
// 
//         return _result
//     }
// }
// 
// class StringSchema extends BaseSchema {
//     constructor() {
//         super();
//         this.rule(
//             "string",
//             (v) => typeof v === "string",
//             {
//                 message: "Must be a string"
//             }
//         );
//     }
// }
// 
// const v = {
//     string: () => new StringSchema(),
//     object: (schema: Record<string | number | symbol, BaseSchema>) => new ObjectSchema(schema),
// }
// 
// // const objectSchema = v.object({
// //     first_name: v.string(),
// //     last_name: v.string().optional(),
// // })
// // 
// // const objectResult = objectSchema.validate({
// //     first_name: "John"
// // })
// 
// const stringSchemaRequired = v.string()
// const stringSchemaOptional = v.string().optional()
// 
// const stringRequiredResult = stringSchemaRequired.validate("John")
// const stringOptionalResult = stringSchemaOptional.validate("")
// 
// 
// // console.log("Object", objectResult)
// console.log("String Required", stringRequiredResult)
// console.log("String Optional", stringOptionalResult)

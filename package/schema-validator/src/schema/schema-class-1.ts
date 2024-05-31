// Base modifier should have two generics, Input and Output
export abstract class BaseModifier {
    optional() {
        return new OptionalModifier(this)
    }
}

export abstract class BaseType extends BaseModifier {
    constructor() {
        super()
    }

    parse(data: unknown) {
        return data
    }
}

// Modifiers
export class OptionalModifier<Schema extends BaseModifier> extends BaseType {
    _schema

    constructor(schema: Schema) {
        super()
        this._schema = schema
    }
}

// Schema implementation which extends the BaseModifier 
export class Schema extends BaseType {
    constructor() {
        super()
    }

    string() {
        return new StringSchema()
    }
}

// Different schema for different data types
export class StringSchema extends BaseType {
    constructor() {
        super()
    }

    min(minValue: number) {
        return this
    }
}

const schema = new Schema()
export default schema;

const s = schema
    .string()
    .min(1)
    .optional()

console.log(s, s.parse("Hello"))

interface SchemaIssue {
    message: string;
    kind: string;
}

interface SchemaError {
    issues: SchemaIssue[]
}

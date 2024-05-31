interface Options {
    isOptional: boolean
}

type Validation<T> = T

// Base classes for Validation library
export abstract class BaseModifier {
    optional() {
        return new OptionalModifier(this)
    }
}

export abstract class BaseType extends BaseModifier {
    protected _options?: Options

    // List of rules to be validated
    protected _validations?: Validation<any>[]

    constructor(options?: Options, validations?: Validation<any>[]) {
        super()

        this._options = options
        this._validations = validations
    }

    parse(args: unknown) {
        // Validate args here...
        return args
    }
}

// Modifiers
export class OptionalModifier<Schema extends BaseModifier> extends BaseModifier {
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

    object(args: Record<string, BaseModifier>) {
        return new ObjectSchema(args)
    }
}

// Different schema for different data types
export class StringSchema extends BaseType {
    constructor() {
        super()
    }

    parse(args: unknown) {
        return args
    }
}

export class ObjectSchema extends BaseType {
    _args

    constructor(args: Record<string, BaseModifier>) {
        super()
        this._args = args
    }

    parse<Args>(args: Args) {
        return args;
    }
}

const schema = new Schema()
export default schema;

// Focus on the following first
// - Base
// - BaseType
// - Optional
// - String
// - Objects
//
// Make sure that all the five classes will be able to communicate properly
// when being parsed, and when an optional property is given
// to a certain key or variable

// Base classes for Validation library
export abstract class BaseModifier {
    optional() {
        return new OptionalModifier(this)
    }

    nullable() {
        return new NullabeModifier(this)
    }
}

export abstract class BaseType extends BaseModifier {
    constructor() {
        super()
    }

    parse<Args>(args: Args) {
        // Validate the passed value here...
        return this
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

export class NullabeModifier<Schema extends BaseModifier> extends BaseModifier {
    _schema

    constructor(schema: Schema) {
        super()
        this._schema = schema
    }
}

// Schema implementation which extends the BaseModifier 
interface Options { }

export class Schema extends BaseType {
    constructor() {
        super()
    }

    string() {
        return new StringSchema()
    }

    number() {
        return new NumberSchema()
    }

    object(args: Record<string, BaseModifier>, opts?: Options) {
        return new ObjectSchema(args, opts)
    }
}

// Different schema for different data types
export class StringSchema extends BaseType {
    constructor() {
        super()
    }
}

export class NumberSchema extends BaseType {
    constructor() {
        super()
    }
}

export class ObjectSchema extends BaseType {
    _options

    constructor(args: Record<string, BaseModifier>, options?: Options) {
        super()
        this._options = options
    }

    parse<Args>(args: Args) {
        return this
    }
}

const schema = new Schema()
export default schema;

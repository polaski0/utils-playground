type CommonType =
    | TypeUnknown
    | TypeString
    | TypeNumber
    | TypeArray<CommonType>
    | TypeObject<Record<string, CommonType>>

interface TypePropertiesExtension {
    _optional?: boolean
}

interface TypeMethodExtension<T> {
    optional(): T
}

interface TypeExtension<T> extends TypePropertiesExtension, TypeMethodExtension<T> { }
interface TypeUnknown extends TypeExtension<unknown> {
    type: "unknown"
    parse(value: unknown): unknown
}
interface TypeString extends TypeExtension<TypeString> {
    type: "string"
    parse(value: unknown): string
}
interface TypeNumber extends TypeExtension<TypeNumber> {
    type: "number"
    parse(value: unknown): number
}
interface TypeArray<T extends CommonType> extends TypeExtension<TypeArray<T>> {
    type: "array"
    element: T
    parse(value: unknown): Array<Infer<T>>
}
interface TypeObject<T extends Record<string, CommonType>> extends TypeExtension<TypeObject<T>> {
    type: "object"
    fields: T
    parse(value: unknown): InferTypeObject<TypeObject<T>>
}
interface TypeError {
    type: "error"
    message: string
}

type Infer<T extends CommonType> = T extends TypeUnknown
    ? unknown
    : T extends TypeString
    ? string
    : T extends TypeNumber
    ? number
    : T extends TypeArray<infer E>
    ? Array<Infer<E>>
    : T extends TypeObject<Record<string, CommonType>>
    ? InferTypeObject<T>
    : never

type InferTypeObject<T extends TypeObject<Record<string, CommonType>>> = {
    [Key in keyof T["fields"]]: Infer<T["fields"][Key]>
}

const unknown = (): TypeUnknown => ({
    type: "unknown",
    parse(value): unknown {
        return value
    },
    optional() {
        return this
    }
})
const string = (): TypeString => ({
    type: "string",
    parse(value): string {
        if (this._optional && value === undefined) {
            return ""
        }

        if (typeof value !== "string") throw new Error("Not a string")
        return value
    },
    optional() {
        this._optional = true
        return this
    }
})

const number = (): TypeNumber => ({
    type: "number",
    parse(value): number {
        if (typeof value !== "number") throw new Error("Not a number")
        return value
    },
    optional() {
        return this
    }
})
const array = <T extends CommonType>(element: T): TypeArray<T> => ({
    type: "array",
    element: element,
    parse(value): Array<Infer<T>> {
        if (!Array.isArray(value)) throw new Error("Not an array")
        value.forEach((val) => this.element.parse(val))
        return value
    },
    optional() {
        return this
    }
})
const object = <T extends Record<string, CommonType>>(fields: T): TypeObject<T> => ({
    type: "object",
    fields: fields,
    parse(value): InferTypeObject<TypeObject<T>> {
        if (typeof value !== "object" || value === null) throw new Error("Not an object")

        const record = value as Record<string, CommonType>
        Object.entries(this.fields).forEach(([k, v]) => v.parse(record[k]))

        return value as InferTypeObject<TypeObject<T>>
    },
    optional() {
        return this
    }
})

export const schema = {
    string,
    number,
    unknown,
    array,
    object
}

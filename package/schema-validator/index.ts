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
    object: (schema: Record<string, SchemaV>) => new ObjectV(schema),
    boolean: () => new BooleanV(), // Not yet implemented
    array: () => new ArrayV(), // Not yet implemented
    date: () => new DateV(), // Not yet implemented
};

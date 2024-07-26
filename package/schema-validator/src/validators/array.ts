import { array } from "../locale";
import { SchemaV } from "./schema";

export class ArrayV extends SchemaV {
    constructor() {
        super();
        this.rule(
            "array",
            (value) => value instanceof Array,
            {
                message: array.default
            }
        );
    }

    min(num: number, message?: string) {
        return this.rule(
            "min",
            (value) => value instanceof Array && value.length >= num,
            {
                message: message ?? array.min,
                value: num,
            }
        );
    }

    max(num: number, message?: string) {
        return this.rule(
            "max",
            (value) => value instanceof Array && value.length <= num,
            {
                message: message ?? array.max,
                value: num,
            }
        );
    }

    contains<T>(needle: T, message?: string) {
        return this.rule(
            "contains",
            (value) => value instanceof Array
                ? value.includes(needle)
                : false,
            {
                message: message ?? array.contains,
                value: needle,
            }
        );
    }
}

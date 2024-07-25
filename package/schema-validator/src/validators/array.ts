import { SchemaV } from "./schema";

export class ArrayV extends SchemaV {
    constructor() {
        super();
        this.rule(
            "array",
            (value) => value instanceof Array,
            {
                message: "Must be an array"
            }
        );
    }

    min(num: number) {
        return this.rule(
            "min",
            (value) => value instanceof Array && value.length >= num,
            {
                message: `Must have a minimum length of ${num}`,
                value: num,
            }
        );
    }

    max(num: number) {
        return this.rule(
            "max",
            (value) => value instanceof Array && value.length <= num,
            {
                message: `Must have a maximum length of ${num}`,
                value: num,
            }
        );
    }

    contains<T>(needle: T) {
        return this.rule(
            "contains",
            (value) => {
                if (value instanceof Array) {
                    return value.includes(needle);
                }

                return false;
            },
            {
                message: needle + " does not exists.",
                value: needle,
            }
        );
    }
}

import { SchemaV } from "./schema";

export class StringV extends SchemaV {
    constructor() {
        super();
        this.rule(
            "String",
            (value) => typeof value === "string",
            {
                message: "Must be type of string"
            }
        );
    }

    min(num: number) {
        return this.rule(
            "Min",
            (value) => typeof value === "string" && value.length >= num,
            {
                message: `Must have a minimum value of ${num}`
            }
        );
    }

    max(num: number) {
        return this.rule(
            "Max",
            (value) => typeof value === "string" && value.length <= num,
            {
                message: `Must have a maximum value of ${num}`
            }
        );
    }
}

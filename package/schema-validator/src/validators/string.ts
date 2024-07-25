import { SchemaV } from "./schema";

export class StringV extends SchemaV {
    constructor() {
        super();
        this.rule(
            "string",
            (value) => typeof value === "string",
            {
                message: "Must be type of string"
            }
        );
    }

    min(num: number) {
        return this.rule(
            "min",
            (value) => typeof value === "string" && value.length >= num,
            {
                message: `Must have a minimum length of ${num}`,
                value: num,
            }
        );
    }

    max(num: number) {
        return this.rule(
            "max",
            (value) => typeof value === "string" && value.length <= num,
            {
                message: `Must have a maximum length of ${num}`,
                value: num,
            }
        );
    }

    matches(regex: RegExp) {
        return this.rule(
            "matches",
            (value) => typeof value === "string" && regex.test(value),
            {
                message: `Does not match ${regex}`,
                value: regex,
            }
        );
    }
}

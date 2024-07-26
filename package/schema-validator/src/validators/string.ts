import { string } from "../locale";
import { SchemaV } from "./schema";

export class StringV extends SchemaV {
    constructor() {
        super();
        this.rule(
            "string",
            (value) => typeof value === "string",
            {
                message: string.default,
            }
        );
    }

    min(num: number, message?: string) {
        return this.rule(
            "min",
            (value) => typeof value === "string" && value.length >= num,
            {
                message: message ?? string.min,
                value: num,
            }
        );
    }

    max(num: number, message?: string) {
        return this.rule(
            "max",
            (value) => typeof value === "string" && value.length <= num,
            {
                message: message ?? string.max,
                value: num,
            }
        );
    }

    matches(regex: RegExp, message?: string) {
        return this.rule(
            "matches",
            (value) => typeof value === "string" && regex.test(value),
            {
                message: message ?? string.matches,
                value: regex,
            }
        );
    }
}

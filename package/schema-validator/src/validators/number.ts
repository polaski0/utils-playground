import { number } from "../locale";
import { SchemaV } from "./schema";

export class NumberV extends SchemaV {
    constructor() {
        super();
        this.rule(
            "number",
            (value) => typeof value === "number",
            {
                message: number.default
            }
        );
    }

    min(num: number, message?: string) {
        return this.rule(
            "min",
            (value) => typeof value === "number" && value >= num,
            {
                message: message ?? number.min,
                value: num,
            }
        );
    }

    max(num: number, message?: string) {
        return this.rule(
            "max",
            (value) => typeof value === "number" && value <= num,
            {
                message: message ?? number.max,
                value: num,
            }
        );
    }
}

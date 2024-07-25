import { SchemaV } from "./schema";

export class NumberV extends SchemaV {
    constructor() {
        super();
        this.rule(
            "number",
            (value) => typeof value === "number",
            {
                message: "Must be a type of number"
            }
        );
    }

    min(num: number) {
        return this.rule(
            "min",
            (value) => typeof value === "number" && value >= num,
            {
                message: `Must be greater than or equal to ${num}`,
                value: num,
            }
        );
    }

    max(num: number) {
        return this.rule(
            "min",
            (value) => typeof value === "number" && value <= num,
            {
                message: `Must be less than or equal to ${num}`,
                value: num,
            }
        );
    }
}

import { SchemaV } from "./schema";

export class NumberV extends SchemaV {
    constructor() {
        super();
        this.rule(
            "Number",
            (value) => typeof value === "number",
            {
                message: "Must be a type of number"
            }
        );
    }

    min(num: number) {
        return this.rule(
            "Min",
            (value) => typeof value === "number" && value >= num,
            {
                message: `Must be greater than or equal to ${num}`
            }
        );
    }

    max(num: number) {
        return this.rule(
            "Min",
            (value) => typeof value === "number" && value <= num,
            {
                message: `Must be less than or equal to ${num}`
            }
        );
    }
}

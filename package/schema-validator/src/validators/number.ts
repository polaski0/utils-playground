import { SchemaV } from "./schema";

export class NumberV extends SchemaV {
    constructor() {
        super();
        this.rule("Number", (value) => typeof value === "number");
    }

    min(num: number) {
        return this.rule(
            "Min",
            (value) => typeof value === "number" && value >= num,
        );
    }

    max(num: number) {
        return this.rule(
            "Min",
            (value) => typeof value === "number" && value <= num,
        );
    }
}

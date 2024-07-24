import { BaseV } from "./base";

export class StringV extends BaseV {
    constructor() {
        super();
        this.rule("String", (value) => typeof value === "string");
    }

    min(num: number) {
        return this.rule(
            "Min",
            (value) => typeof value === "string" && value.length >= num,
        );
    }

    max(num: number) {
        return this.rule(
            "Max",
            (value) => typeof value === "string" && value.length <= num,
        );
    }
}

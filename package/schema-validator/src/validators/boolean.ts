import { SchemaV } from "./schema";

export class BooleanV extends SchemaV {
    constructor() {
        super();
        this.rule(
            "boolean",
            (value) => typeof value === "boolean",
            {
                message: "Must be type of boolean"
            }
        );
    }
}

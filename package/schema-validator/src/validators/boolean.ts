import { SchemaV } from "./schema";

export class BooleanV extends SchemaV {
    constructor() {
        // Not yet implemented
        super();
        this.rule(
            "Boolean",
            (value) => typeof value === "boolean",
            {
                message: "Must be type of boolean"
            }
        );
    }
}

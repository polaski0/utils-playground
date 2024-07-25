import { SchemaV } from "./schema";

export class DateV extends SchemaV {
    constructor() {
        // Not yet implemented
        super();
        this.rule(
            "date",
            (value) => value instanceof Date,
            {
                message: "Must be a type of date"
            }
        );
    }
}

import { date } from "../locale";
import { SchemaV } from "./schema";

export class DateV extends SchemaV {
    constructor() {
        super();
        this.rule(
            "date",
            (value) => value instanceof Date,
            {
                message: date.default,
            }
        );
    }
}

import { SchemaV } from "./schema";

export class DateV extends SchemaV {
    constructor() {
        // Not yet implemented
        super();
        this.rule("Date", (value) => value instanceof Date);
    }
}

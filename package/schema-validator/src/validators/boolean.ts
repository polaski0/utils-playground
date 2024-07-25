import { SchemaV } from "./schema";

export class BooleanV extends SchemaV {
    constructor() {
        // Not yet implemented
        super();
        this.rule("Boolean", (value) => typeof value === "boolean");
    }
}

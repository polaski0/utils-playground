import { SchemaV } from "./schema";

export class ArrayV extends SchemaV {
    constructor() {
        // Not yet implemented
        super();
        this.rule("Array", (value) => value instanceof Array);
    }
}

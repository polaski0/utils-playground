import { BaseV } from "./base";

export class ArrayV extends BaseV {
    constructor() {
        // Not yet implemented
        super();
        this.rule("Array", (value) => value instanceof Array);
    }
}

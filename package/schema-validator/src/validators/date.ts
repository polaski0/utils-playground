import { BaseV } from "./base";

export class DateV extends BaseV {
    constructor() {
        // Not yet implemented
        super();
        this.rule("Date", (value) => value instanceof Date);
    }
}

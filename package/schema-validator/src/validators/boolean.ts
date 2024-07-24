import { BaseV } from "./base";

export class BooleanV extends BaseV {
    constructor() {
        // Not yet implemented
        super();
        this.rule("Boolean", (value) => typeof value === "boolean");
    }
}

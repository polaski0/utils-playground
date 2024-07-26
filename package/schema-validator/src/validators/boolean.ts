import { boolean } from "../locale";
import { SchemaV } from "./schema";

export class BooleanV extends SchemaV {
    constructor() {
        super();
        this.rule(
            "boolean",
            (value) => typeof value === "boolean",
            {
                message: boolean.default,
            }
        );
    }
}

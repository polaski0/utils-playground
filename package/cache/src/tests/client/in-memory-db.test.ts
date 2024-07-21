import config from "./config"
import { logResult } from "../../utils/logger";
import { client } from "./client";
import { parse } from "../../utils/date";

const cache = client(config)

// Will be moved to its respective file
describe("date utilities", () => {
    it("should split the value properly", () => {
        const value = parse("1h10m")
        const expected = ["1", "h", "10", "m"]

        logResult(expected, value)
        expect(value).toEqual(expected)
    })
})

describe.skip("in-memory database", () => {
    it("should log config", () => {
        console.log(cache, config)
    })
})


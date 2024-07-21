import config from "./config"
import { logResult } from "../../utils/logger";
import { client } from "./client";
import { convertToMilliseconds, parse } from "../../utils/date";
import { performanceBenchmark } from "../../utils/performance";

const cache = client(config)

// Will be moved to its respective file
describe("date utilities", () => {
    it.skip("should split the value properly", () => {
        const expected = ["1", "h", "10", "m"]
        let value

        performanceBenchmark(() => {
            value = parse("1h10m")
        })

        expect(value).toEqual(expected)
        logResult(expected, value)
    })

    it("should equal to an hour from now", () => {
        const testValue = parse("1h")
        const expected = new Date()
        expected.setHours(expected.getHours() + 1)
        let value: number = -1

        performanceBenchmark(() => {
            value = convertToMilliseconds(testValue)
        })

        expect(new Date(value).toString()).toBe(new Date(expected).toString())
        logResult(new Date(expected), new Date(value))
    })
})

describe.skip("in-memory database", () => {
    it("should log config", () => {
        console.log(cache, config)
    })
})


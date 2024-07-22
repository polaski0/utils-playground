import { logResult } from "../utils/logger";
import { parse, split } from "../utils/date";
import { performanceBenchmark } from "../utils/performance";

describe("date utilities", () => {
    it("should split the value properly", () => {
        const expected = ["1", "h", "10", "m"]

        let value
        performanceBenchmark(() => {
            value = split("1h10m")
        })

        expect(value).toEqual(expected)
        logResult(expected, value)
    })

    it("should equal to an hour from now", () => {
        const testValue = "1h10m"
        const expected = new Date()
        expected.setHours(expected.getHours() + 1)
        expected.setMinutes(expected.getMinutes() + 10)

        let value: number = -1
        performanceBenchmark(() => {
            value = parse(testValue)
        })

        expect(new Date(value).toString()).toBe(new Date(expected).toString())
        console.log("Base Date:", new Date())
        logResult(new Date(expected), new Date(value))
    })
})

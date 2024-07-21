import config from "./config"
import { logResult } from "../../utils/logger";
import { client } from "./client";
import { convertToMilliseconds, parse } from "../../utils/date";
import { performanceBenchmark } from "../../utils/performance";

const cache = client(config)


describe.skip("in-memory database", () => {
    it("should log config", () => {
        console.log(cache, config)
    })
})


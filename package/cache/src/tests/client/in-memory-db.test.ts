import config from "./config"
import data from "./data"
import { logResult } from "../../utils/logger";
import { client, TCacheProps } from "./client";

/**
    * Wrapper for cache
    */
const database = ({ sets, ...opts }: TCacheProps) => {
    const cache = client(opts)

    if (sets) {
        for (const set of sets) {
            cache.set(set.name, [], 0) // Infinite for now
        }
    }

    return {
        ...cache
    }
}

const db = database(config)

describe("in-memory database", () => {
    beforeAll(() => {
        let value: keyof typeof data
        for (value in data) {
            db.set(value, data[value])
        }
    })

    it("should log the contents", () => {
        const authors = db.get("authors")
        console.log(authors)
        expect(authors).not.toBeUndefined();
    })
})


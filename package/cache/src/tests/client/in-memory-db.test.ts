import config from "./config"
import data from "./data"
import { logResult } from "../../utils/logger";
import { client, TCacheProps } from "./client";
import { parse } from "../../utils/date";


/**
    * Wrapper for cache
    */
const database = <T>({ sets, ...opts }: TCacheProps) => {
    type TDbContents<T> = {
        [key in keyof T]: ReturnType<typeof _methods>
    }

    const cache = client(opts)
    const contents: TDbContents<T> = {} as TDbContents<T>

    function init() {
        if (sets) {
            for (const set of sets) {
                cache.set(
                    set.name,
                    [],
                    typeof set.ttl === "string"
                        ? parse(set.ttl)
                        : typeof set.ttl === "number"
                            ? set.ttl
                            : undefined
                )

                contents[(set.name as keyof T)] = _methods(set.name)
            }
        }
    }

    function _methods(key: string) {
        const Get = (value?: unknown) => {
            return cache.get(key)
        }

        const Insert = (value: any) => {
            const _dat = cache.get(key)

            // Code here...
        }

        const Update = (key: any, value: any) => {
            // Code here...
        }

        const Delete = (key: any) => {
            // Code here...
        }

        return {
            Get,
            Insert,
            Update,
            Delete
        }
    }

    // Initializes all sets passed
    init()

    return {
        ...contents,
        ...cache
    }
}

const db = database<typeof data>(config)

describe("in-memory database", () => {
    beforeAll(() => {
        let value: keyof typeof data
        for (value in data) {
            db[value].Insert(data[value])
        }
    })

    it("should log the contents", () => {
        // const authors = db.get("authors")
        // console.log(authors)
        // expect(authors).not.toBeUndefined();
    })
})


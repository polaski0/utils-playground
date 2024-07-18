import { deepAssign } from "."

describe("deep assign", () => {
    test("should assign based on heirarchy", () => {
        // Test cases
        const testData: Record<string, any> = {
            "a.b.c": 1,
        }
        const expected: Record<string, any> = {
            a: {
                b: {
                    c: 1
                },
            }
        }

        const obj = deepAssign(testData)

        expect(obj).toEqual(expected)
    })

    test("should append to similar elements and create an array", () => {
        // Test cases
        const testData: Record<string, any> = {
            "a.b.c": 1,
            "a.b": 2,
            "a.b.c.d": 3,
            "x": 1,
            "y.z": 2,
        }
        const expected: Record<string, any> = {
            a: {
                b: [
                    {
                        c: [
                            { d: 3 },
                            1
                        ]
                    },
                    2,
                ],
            },
            x: 1,
            y: {
                z: 2,
            },
        }

        const obj = deepAssign(testData)
        expect(obj).toEqual(expected)
    })
})

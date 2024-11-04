import { number } from "./schemas/number/number"
import { object } from "./schemas/object/object"
import { string } from "./schemas/string/string"
import { trim } from "./transformers/trim"
import { max } from "./validators/max"
import { min } from "./validators/min"
import { transform } from "./transformers/transform"
import { parse } from "./methods/parse"
import { FormattedError, ValidationError, format } from "./error"
import { email } from "./validators/email"
import { oneOf } from "./validators/oneOf"
import { array } from "./schemas/array/array"
import { Infer } from "./types"

describe("error", () => {
    it("should properly display necessary errors based on its path", () => {
        const schema = object({
            email: string(
                "Invalid email.",
                [
                    trim(),
                    email(),
                ]
            ),
            password: string(
                "Invalid password.",
                [
                    trim(),
                    min(4),
                    max(8),
                ]
            ),
            address: object({
                zipCode: number(),
                street: string([
                    transform(value => {
                        return `${value} St.`
                    })
                ])
            }),
            roles: array(
                string([
                    oneOf(["user", "admin"]),
                    min(4),
                    max(5),
                ]),
                [
                    min(1, "Should have at least one role.")
                ]
            )
        })

        type TSchema = Infer<typeof schema>
        let errors: FormattedError<TSchema> | undefined = undefined

        try {
            parse(schema, {
                roles: ["", "customer"]
            })
        } catch (err) {
            errors = format<TSchema>((err as ValidationError))
        }

        const expected = {
            email: {
                issues: [
                    {
                        type: "string",
                        input: undefined,
                        message: "Invalid email."
                    }
                ]
            },
            password: {
                issues: [
                    {
                        type: "string",
                        input: undefined,
                        message: "Invalid password."
                    }
                ]
            },
            address: {
                issues: [
                    {
                        type: "object",
                        input: undefined,
                        message: "Invalid type"
                    }
                ],
                zipCode: {
                    issues: [
                        {
                            type: "number",
                            input: undefined,
                            message: "Invalid type"
                        }
                    ]
                },
                street: {
                    issues: [
                        {
                            type: "string",
                            input: undefined,
                            message: "Invalid type"
                        }
                    ]
                },
            },
            roles: {
                issues: [
                    {
                        type: 'string',
                        message: '"" is not included on the selections: "user", "admin".',
                        input: ''
                    },
                    {
                        type: 'string',
                        message: 'Must have a minimum length of 4',
                        input: ''
                    },
                    {
                        type: 'string',
                        message: '"customer" is not included on the selections: "user", "admin".',
                        input: 'customer'
                    },
                    {
                        type: 'string',
                        message: 'Must have a maximum length of 5',
                        input: 'customer'
                    }
                ]
            }
        }

        expect(errors).not.toBeUndefined()
        expect(errors).toEqual(expected)
    })
})

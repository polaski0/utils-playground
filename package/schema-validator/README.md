# Schema Validator

This is a schema validator based on a JavaScript library called [vlid](https://github.com/vlucas/vlid).

# Purpose

The purpose of this is to apply type-safety and learn how to validate a JSON object without any usage of third-party dependencies.

## Todo

- [x] Support for the following primitives:
  - [x] Number
  - [x] String
  - [x] Array
  - [x] Date
  - [x] Object
  - [x] Boolean
- [ ] Create tests for schema
- [ ] Fix recursive validation of `ObjectV`
- [ ] Create custom error for the Validation class
- [ ] Fix adding of error
- [ ] Fix return value of `validate` method
  - [ ] error
    - [ ] Array of custom errors
  - [ ] value
    - [ ] Value passed on the validation function
  - [ ] isValid
    - [ ] Boolean

## Validations

```js
const validations = {
    alpha_dash(args) {
        if (typeof args.input === "string") {
            const regex = /^[a-zA-Z0-9-_]+$/;
            return !regex.test(args.input);
        }

        return true;
    },

    alpha_numeric(args) {
        if (typeof args.input === "string") {
            const regex = /^[a-zA-Z0-9]+$/;
            return !regex.test(args.input);
        }
        return true;
    },

    contains(args) {
        return !(args.value.includes(args.input));
    },

    email(args) {
        if (typeof args.input === "string") {
            return !(useCommonUtils().Validators.IsEmail(args.input));
        }

        return true;
    },

    integer(args) {
        return !(useCommonUtils().Validators.IsInteger(args.input));
    },

    lowercase(args) {
        if (typeof args.input === "string") {
            return args.input !== args.input.toLowerCase();
        }

        return true;
    },

    max(args) {
        if (typeof args.input === "number" || typeof args.input === "string") {
            return args.input.toString().length > args.value;
        } else if (args.input instanceof Array) {
            return args.input.length > args.value;
        } else if (args.input instanceof Object) {
            return Object.entries(args.input).length > args.value;
        }

        return true;
    },

    min(args) {
        if (typeof args.input === "number" || typeof args.input === "string") {
            return args.input.toString().length < args.value;
        } else if (args.input instanceof Array) {
            return args.input.length < args.value;
        } else if (args.input instanceof Object) {
            return Object.entries(args.input).length < args.value;
        }

        return true;
    },

    string(args) {
        return !(useCommonUtils().Validators.IsString(args.input));
    },

    uppercase(args) {
        if (typeof args.input === "string") {
            return args.input !== args.input.toUpperCase();
        }

        return true;
    },

    matches(args) {
        if (typeof args.input === "string") {
            return !(useCommonUtils().Validators.Regex.Match(args.value, args.input));
        }

        return true;
    },
}
```

## Return Type
```js
{
  typed: true,
  success: false,
  output: {
    email: "jane@example.com",
    password: ""
  },
  issues: [
    {
      kind: "validation",
      type: "min_length",
      input: "",
      expected: ">=8",
      received: "0",
      message: "Invalid length: Expected >=8 but received 0",
      requirement: 8,
      path: [
        {
          type: "object",
          origin: "value",
          input: {
            email: "jane@example.com",
            password: ""
          },
          key: "password",
          value: ""
        }
      ],
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined
    }
  ]
}
```


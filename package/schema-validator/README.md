# Schema Validator

This is a schema validator based on a JavaScript library called [vlid](https://github.com/vlucas/vlid).

# Purpose

The purpose of this is to apply type-safety and learn how to validate a JSON object without any usage of third-party dependencies.

## Todo

- [ ] Support for the following primitives:
  - [ ] Number
  - [ ] String
  - [ ] Array
  - [ ] Date
  - [ ] Object
  - [ ] Boolean
- [ ] Create tests for schema
- [ ] Fix recursive validation of `ObjectV`
- [ ] Create custom error for the Validation class
- [ ] Fix return value of `validate` method
  - [ ] error
    - [ ] Array of custom errors
  - [ ] value
    - [ ] Value passed on the validation function
  - [ ] isValid
    - [ ] Boolean

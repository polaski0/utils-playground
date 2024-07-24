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

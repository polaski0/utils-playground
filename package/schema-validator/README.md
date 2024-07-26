# Schema Validator

This is a schema validator based on a JavaScript library called [vlid](https://github.com/vlucas/vlid).

## Purpose

The purpose of this is to apply type-safety and learn how to validate a JSON object without any usage of third-party dependencies.

## Todo

- [x] Support for the following primitives:
  - [x] Number
  - [x] String
  - [x] Array
  - [x] Date
  - [x] Object
  - [x] Boolean

- [ ] Create custom error class that extends Error interface

- [x] Create error locales:
  - [x] Number
  - [x] String
  - [x] Array
  - [x] Date
  - [x] Object
  - [x] Boolean

- [ ] Validation methods
  - [ ] Add support for custom messages
  - [ ] Nested objects validation
  - [ ] Displaying of invalid keys

- [ ] Create tests for schema

- [ ] Create proper types and interfaces
  - [ ] Interface for `SchemaV`
  - [ ] Error types

- [ ] Additional options on `SchemaV`
  - [ ] Removed unvalidated keys
  - [ ] Stop on first error
  - [ ] Validate async

# Schema Validator

## Table of Contents

* [Introduction](#introduction)

## Introduction

Schema validator with no third-party dependencies.

> This is heavily inspired by [Valibot Bachelor's Thesis](https://valibot.dev/thesis.pdf)

## Todo

### Schemas

Schemas.

- [x] string
- [x] number
- [x] object
- [x] array
- [x] date
- [x] boolean

### Modifiers

Modifiers.

- [x] optional
- [x] nullable

### Validators

Validators.

- [x] min
- [x] max
- [x] oneOf
- [x] email
- [x] matches
- [x] custom
- [] equals

### Transformers

Alters the current data.

- [x] transform
- [x] trim

### Error

ValidationError.

- [x] Add formatter which is used on objects.
    - [x] Should properly format based on path.
- [] Fix context of `object` and `array` schema
wherein the `path` will provide a meaningful context.
    - [] object
        - [] type
            - Identifier for `object` path
        - [] parent
            - The parent path before reaching the `key`
        - [] key
            - Exact key that caused a parsing error
    - [] array
        - [] type
            - Identifier for `array` path
        - [] parent
            - The parent path before reaching the `index`
        - [] index
            - Exact position that caused a parsing error

### Types

Typing system of the schema.

- [] Improve typing system

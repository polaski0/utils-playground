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

- [] Add formatter which is used on objects.
    - [] Should properly format based on path.

### Types

Typing system of the schema.

- [] Improve typing system

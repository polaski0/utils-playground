# Schema Validator

## Table of Contents

* [Introduction](#introduction)
* [How to Use](#how-to-use) - in progress
* [Methods](#methods) - in progress
* [How it Works](#how-it-works) - in progress
* [Todo](#todo) - in progress

## Introduction

Schema validator with no third-party dependencies.

> Still being improved.

### Inspired by

Different libraries I used as a reference material to build this:
* [valita](https://github.com/badrap/valita)
* [zod](https://github.com/colinhacks/zod)

## How to use

### Primitive Types

Supports the following primitive types:
- Number
- String
- Array
- Date
- Object
- Boolean

To check if a certain value is of type primitive, you can use a specific primitive. 
For example, `s.string()` is used to check if the value is a type of string:

```js
import { s } from "."

const str = s.string();
str.validate("Hello, world!");
// Valid
```

Parsing values that does not align with its primitive returns an error:

```js
str.validate(1);
// Invalid
```

### Optional Properties

To allow `null` and `undefined` values, simply add `.optional()` on the schema.

```js
const obj = s.object({
    first_name: s.string(),
     // Not everyone have a middle name
    middle_name: s.string().optional(),
    last_name: s.string(),
})

obj.validate({
    first_name: "John",
    last_name: "Doe"
})
// Valid
```

> This is not limited to object schema.

## Todo
- [ ] Types
    - [ ] Allow generating of types based on schema 
- [x] Primitives
    - [x] string
    - [x] number
    - [x] object
    - [x] array
    - [x] date
    - [x] boolean
- [ ] Tranformer
- [ ] Coerce
- [ ] Object Schema
 - [ ] Stop on first error
 - [ ] Strip unvalidated keys / keys that isn't included in schema
- [ ] Async validation

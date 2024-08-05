# Schema Validator

## Table of Contents

* [Introduction](#introduction)
* [How to Use](#how-to-use) - WIP
* [Methods](#methods) - WIP
* [How it Works](#how-it-works) - WIP
* [Todo](#todo) - WIP

## Introduction

Schema validator with no third-party dependencies.

### Inspired by

Different libraries I used as a reference material to build this:
* [valita](https://github.com/badrap/valita)
* [zod](https://github.com/colinhacks/zod)

## How to use

### Basic Usage

To check if a certain value is of type primitive, you can use a specific primitive. 
For example, `v.string()` is used to check if the value is a type of string:

```js
import { v } from "."

const str = v.string();
str.validate("Hello, world!");
// Valid
```

Parsing values that does not align with its primitive returns an error:

```js
str.validate(1);
// Invalid
```

You can use different primitives to build an object schema:
```js
const user = v.object({
    username: v.string(),
    email: v.string(),
});

user.validate({
    username: "john_doe",
    email: "john_doe@exmaple.com",
});
// Valid
```

### Primitive Types

Supports the following primitive types:
```js
import { v } from ".";

v.string()
v.number()
v.object()
v.array()
v.date()
v.boolean()
```

### Optional Properties

To allow `null` and `undefined` values, simply add `.optional()` on the schema.

```js
const user = v.object({
    first_name: v.string(),
     // Not everyone have a middle name
    middle_name: v.string().optional(),
    last_name: v.string(),
})

user.validate({
    first_name: "John",
    last_name: "Doe"
})
// Valid
```

> This is not limited to object schema.

## Methods

### Strings - WIP

### Number - WIP

### Object - WIP

### Array - WIP

### Date - WIP

### Boolean - WIP

## Todo
- [ ] Types
    - [ ] Allow generating of types based on schema 
- [ ] Primitives
    - [x] string
    - [x] number
    - [x] object
    - [x] array
    - [x] date
    - [x] boolean
    - [ ] null
    - [ ] undefined
    - [ ] literals
- [ ] Schema
    - [ ] Allow overriding of default message
- [ ] Object Schema
    - [ ] Stop on first error
    - [ ] Strip unvalidated keys / keys that isn't included in schema
- [ ] Methods
    - [ ] Expand validation methods of different primitives
- [ ] Tranformer
- [ ] Coercion
- [ ] Async validation

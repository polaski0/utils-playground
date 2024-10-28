# Schema Validator 1


## Table of Contents

* [Introduction](#introduction)

## Introduction

Schema validator with no third-party dependencies.

## Reference

[superstruct](https://github.com/ianstormtaylor/superstruct/blob/main/src/structs/types.ts)

## Possible Reference

```js
// Superstruct
// Define a `User` struct.
const User = object({
  id: number(),
  name: string(),
})

// Define an `Article` struct, composing the `User` struct in the article's
// `author` property.
const Article = object({
  id: number(),
  title: string(),
  published_at: date(),
  author: User,
})

// Define data to be validated.
const data = {
  id: 1,
  title: 'Hello, World!',
  published_at: new Date(),
  author: {
    id: 1,
    name: 'Jane Smith',
  },
}

// Validate the data. In this case, the data is valid, so it won't throw.
assert(data, Article)
```

```js
// Ajv
const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
  type: "object",
  properties: {
    foo: {type: "integer"},
    bar: {type: "string"}
  },
  required: ["foo"],
  additionalProperties: false
}

const data = {foo: 1, bar: "abc"}
const valid = ajv.validate(schema, data)
if (!valid) console.log(ajv.errors)
```


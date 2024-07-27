# Schema Validator

This is a schema validator based different JavaScript libraries:
* [valita](https://github.com/badrap/valita)
* [zod](https://github.com/colinhacks/zod)

## Purpose

The purpose of this is to apply type-safety and learn how to validate a JSON object 
without any usage of third-party dependencies.

## Zod Data Flow

### How data flows from `parse()` method until it returns

1. Calls abstract `parse()` method of the element

- Methods called (in respective order)
    - parse()

```ts
const schema = z.obj({
    a: z.string()
})

schema.parse({}) // Entry point
```

2. The `parse()` method calls the `safeParse()` method internally 

- Methods called (in respective order)
    - parse()
    - safeParse()

```ts

// Inside ZodType abstract class
parse(args: any) {
    this.safeParse(args)
}

safeParse(args: any) {
    const ctx = {}

    const result = this._parseSync(...args);
}
```

3. The `safeParse()` method calls the `_parseSync()` method internally which calls
the internal `_parse()` of a specific schema. For example, ZodString's `_parse()` to
check the data provided by looping through all the added checks using the internal `_addCheck()`
methods.

- Methods called (in respective order)
    - safeParse()
    - _parseSync()
    - _parse()
- Called before parsing
    - _addCheck()

```ts
// Inside ZodType abstract class
safeParse(args: any) {
    const ctx = {}

    const result = this._parseSync(...args);
}

_parseSync(input: any): ReturnType<any> {
    const result = this._parse(input);
    if (isAsync(result)) {
        throw new Error("Error occured");
    }
    return result;
}
```

4. Once the `_parseSync()` method is finished. Return the result and call `handleResult()` method

```ts
// Inside ZodType abstract class
safeParse(args: any) {
    const ctx = {}

    const result = this._parseSync(...args);

    return this.handleResult(...result); // Returning method
}

_parseSync(input: any): ReturnType<any> {
    const result = this._parse(input);
    return result;
}
```

5. `handleResult()` will call `isValid()` method to check if the result is valid or not. `isValid()`
simply checks if the `status` key is valid or not and return a boolean value

```ts
const handleResult = <Input, Output>(args: any):
  | { success: true; data: Output }
  | { success: false; error: Error<Input> } => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }

    return {
      success: false,
      get error() {
        if ((this as any)._error) return (this as any)._error as Error;
        const error = new ZodError(ctx.common.issues);
        (this as any)._error = error;
        return (this as any)._error;
      },
    };
  }
};

export const isValid = (x: any): boolean =>
  x.status === "valid";
```

6. If the status is not valid, create a `ZodError` instance with all the required value then return
the error back to the client.

### How errors are generated based on the schema and checks given

Assume that we have the given schema. We will break down how the schema was created and
how does data flow.

```ts
const schema = z.object({
    name: z.string(),
    addtl: z.object({
        address: z.object({
            street: z.string()
        })
    })
})

schema.parse({})
```

1.


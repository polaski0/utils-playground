# Multipart Parser

Given that the header is a 'content-type' of 'multipart/form-data'.
Create a parser that will parse the following fields.

The parser should also support streaming as it will be reading on
a chunk of data with variable sizes.

```
{
  'content-length': '256',
  'content-type': 'multipart/form-data; boundary=------------------------SJYfZngiJf5M2B7QIA8XjC'
}

--------------------------SJYfZngiJf5M2B7QIA8XjC
Content-Disposition: form-data; name="foo"

bar
--------------------------SJYfZngiJf5M2B7QIA8XjC
Content-Disposition: form-data; name="fizz"

buzz
--------------------------SJYfZngiJf5M2B7QIA8XjC--

```

The parsed value should return the following object:

```js
    // For single data
    const parsedData = {
        name: "foo",
        value: "bar"
    }

    // For single data
    const parsedData = [
        {
            name: "foo",
            value: "bar"
        },
        {
            name: "fizz",
            value: "buzz"
        },
    ]
```

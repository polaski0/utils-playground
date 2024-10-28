# Multipart Parser

A multipart request typically contains the following:

```bash
POST / HTTP/1.1
Host: localhost:8000
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: keep-alive
Upgrade-Insecure-Requests: 1
Content-Type: multipart/form-data; boundary=---------------------------8721656041911415653955004498
Content-Length: 465

-----------------------------8721656041911415653955004498
Content-Disposition: form-data; name="myTextField"

Test
-----------------------------8721656041911415653955004498
Content-Disposition: form-data; name="myCheckBox"

on
-----------------------------8721656041911415653955004498
Content-Disposition: form-data; name="myFile"; filename="test.txt"
Content-Type: text/plain

Simple file.
-----------------------------8721656041911415653955004498--

```

This can be broken down into the following elements:

```bash
<request>
<header>
...
<header>

--<boundary>
<form-data-header>

<data>
--<boundary>
<form-data-header>

<data>
--<boundary>--
```

Elements are separated by a delimiter or boundary which
came from the request headers. This is used to determine 
the different fields of the request body.

Inside the `<boundary>` are another set of `<header>` and the
`<data>` itself which can be determined by the `line feed` separator
between the two contents.

## Simplified BNF Syntax

> From [stackoverflow](https://stackoverflow.com/questions/27993445/is-this-a-well-formed-multipart-form-data-request)

```
multipart-body := [preamble CRLF]
                  dash-boundary CRLF
                  body-part *encapsulation
                  close-delimiter
                  [CRLF epilogue]

dash-boundary := "--" boundary

body-part := MIME-part-headers [CRLF *OCTET]

encapsulation := delimiter
                 CRLF body-part

delimiter := CRLF dash-boundary

close-delimiter := delimiter "--"
```

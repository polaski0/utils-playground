// import { schema } from "./src/schema/schema-function";
// 
// const s = schema.object({
//     first_name: schema.string(),
//     last_name: schema.string(),
//     age: schema.number(),
//     address: schema.object({
//         street: schema.string().optional(),
//         city: schema.string()
//     })
// })
// 
// console.log(s)
// 
// const obj = {
//     first_name: "John",
//     last_name: "Doe",
//     age: 21,
//     address: {
//         city: "New York"
//     }
// }
// 
// console.log(s.parse(obj))

import schema from "./src/schema/schema-class"

const s = schema.object({
    "first-name": schema.string().optional(),
    "last-name": schema.string()
})

const obj = {
    "first-name": "John",
    "last-name": "Doe"
}

s.parse(obj)

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
    first_name: schema.string(),
    middle_name: schema.string().optional(),
    last_name: schema.string()
})

const obj = {
    first_name: "John",
    last_name: "Doe"
}

console.log("Schema: ", s)
console.log("Parsed result: ", s.parse(obj))

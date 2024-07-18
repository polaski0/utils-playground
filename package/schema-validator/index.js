import v from "vlid";

const schema = v.object({
  name: v.string().required(),
  age: v.number(),
  address: v.string(),
});

const data = {
  name: "John",
};

const result = v.validateSync(schema, data);
console.log(result);

const stringSchema = v.string().required();
const stringResult = stringSchema.validateSync("");
console.log(stringResult);

import Joi from "joi";

console.log(JSON.stringify({ error: "TEST", message: "Test error" }));

const schema = Joi.object<{ test: string }>({
  test: Joi.string().required(),
});

const input = {
  testtnpx: 10,
};

const validation = schema.validate(input);

if (validation.error) {
  console.log(validation.error);
  console.log(validation.error.message);
} else {
  console.log(validation.value);
}

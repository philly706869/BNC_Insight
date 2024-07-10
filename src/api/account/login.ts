import { Router } from "express";
import Joi from "joi";

export const loginRouter = Router();

const bodySchema = Joi.object<{ id: string; password: string }>({
  id: Joi.string().required(),
  password: Joi.string().required(),
});

loginRouter.post("/", async (req, res) => {
  const validation = bodySchema.validate(req.body);
  if (validation.error) {
    res.status(400).error({ errors: [{ error: "", message: "" }] });
    return;
  }

  console.log("login");
  res.status(500).end();

  // const { id, password } = validation.value;

  // const errors: { error: string; message: string }[] = [];

  // const idValidation = User.validateId(id);
  // const passwordValidation = User.validatePassword(password);

  // return; // TODO

  // const user = await User.findUserById(id);

  // if (user === null) {
  //   res.status(400).error({ errors: [{ error: "", message: "" }] });
  //   return;
  // }

  // if (!bcrypt.compareSync(password, user.password)) {
  //   res.status(400).error({ errors: [{ error: "", message: "" }] });
  //   return;
  // }

  // req.session.user = {
  //   uid: user.uid,
  //   isAdmin: user.isAdmin,
  // };

  // res.status(201).end();
});

import bcrypt from "bcrypt";
import { Router } from "express";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";
import { AuthToken } from "../../model/AuthToken.js";
import { User } from "../../model/User.js";
import { authRouter } from "./auth.js";
import { loginRouter } from "./login.js";
import { logoutRouter } from "./logout.js";

export const accountRouter = Router();

accountRouter.use("/auth", authRouter);
accountRouter.use("/login", loginRouter);
accountRouter.use("/logout", logoutRouter);

const postSchema = Joi.object<{
  token: string;
  id: string;
  password: string;
  name: string;
}>({
  token: Joi.string().required(),
  id: Joi.string().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
}).unknown(true);

accountRouter.post("/", async (req, res) => {
  const validation = postSchema.validate(req.body);
  if (validation.error) {
    res.status(400).end();
    return;
  }

  const { token, id, password, name } = validation.value;

  const authToken = await AuthToken.findIfAllocable(token);
  if (!authToken) return Promise.reject();

  const user = await User.create({
    uuid: uuidv4(),
    tokenUid: authToken.uid,
    id,
    password: bcrypt.hashSync(password, 10),
    name,
    isAdmin: authToken.isAdminToken,
  });

  authToken.allocedUserUid = user.uid;
  await authToken.save();

  res.status(201).end();
});

const getSchema = Joi.object<{ uuid: string | undefined }>({
  uuid: Joi.string().uuid().optional(),
}).unknown(true);

accountRouter.get("/", async (req, res) => {
  const validation = getSchema.validate(req.query);
  if (validation.error) {
    res.status(400).end();
    return;
  }
  const { uuid } = validation.value;
  const uid = req.session.user?.uid;

  const user = uuid
    ? await User.findOne({ where: { uuid } })
    : uid
    ? await User.findByPk(uid)
    : null;

  if (!user) {
    res.status(400).end();
    return;
  }

  res.status(200).json({
    user: {
      uuid: user.uuid,
      name: user.name,
      isAdmin: user.isAdmin,
    },
  });
});

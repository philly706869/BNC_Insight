import bcrypt from "bcrypt";
import { Router } from "express";
import { query, validationResult } from "express-validator";
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
});

accountRouter.post("/", async (req, res) => {
  const validation = postSchema.validate(req.body);
  if (validation.error) {
    res
      .status(400)
      .error({ errors: [{ error: "INVALID_DATA_FORMAT", message: "" }] });
    return;
  }
  const { token: tokenName, id, password, name } = validation.value;

  const token = await AuthToken.findIfAllocable(tokenName);

  if (!token) {
    res.status(400).error({ errors: [{ error: "", message: "" }] });
    return;
  }

  const user = await User.create({
    uuid: uuidv4(),
    tokenUid: token.uid,
    id,
    password: bcrypt.hashSync(password, 10),
    name,
    isAdmin: token.isAdminToken,
  });

  token.allocedUserUid = user.uid;
  await token.save();

  res.status(201).end();
});

accountRouter.get("/", query("uuid").isUUID().optional(), async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    res.status(400).error({
      errors: [
        {
          error: "INVALID_UUID",
          message: "Uuid is not in correct format.",
        },
      ],
    });
    return;
  }

  const queryUUID: string | undefined = req.query!!.uuid;
  const requestUID = req.session.user?.uid;

  const user = queryUUID
    ? await User.findOne({ where: { uuid: queryUUID } })
    : requestUID
    ? await User.findByPk(requestUID)
    : undefined;

  switch (user) {
    case undefined:
      res.status(400).error({
        errors: [
          {
            error: "USER_SPECIFIC_UNABLE",
            message: "You must be logged in or provide id.",
          },
        ],
      });
      break;
    case null:
      res.status(404).error({
        errors: [
          {
            error: "USER_NOT_FOUND",
            message: "The requested user does not exist.",
          },
        ],
      });
      break;
    default:
      res.status(200).json({
        user: {
          uuid: user.uuid,
          name: user.name,
          isAdmin: user.isAdmin,
        },
      });
      break;
  }
});

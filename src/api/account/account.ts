import bcrypt from "bcrypt";
import { Router } from "express";
import { body, query, validationResult } from "express-validator";
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

accountRouter.post(
  "/",
  body("authToken")
    .isString()
    .bail()
    .custom(async (token: string) =>
      (await AuthToken.isAllocable(token))
        ? Promise.resolve()
        : Promise.reject()
    ),
  body("id")
    .isString()
    .bail()
    .custom(async (id: string) =>
      User.validateId(id) === null && (await User.findUserById(id)) === null
        ? Promise.resolve()
        : Promise.reject()
    ),
  body("password")
    .isString()
    .custom((password: string) => User.validatePassword(password) === null),
  body("name")
    .isString()
    .custom((name: string) => User.validateName(name) === null),
  async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      res
        .status(400)
        .error({ errors: [{ error: "INVALID_DATA_FORMAT", message: "" }] });
      return;
    }

    const { authToken, id, password, name }: { [key: string]: string } =
      req.body;

    const token = (await AuthToken.findOne({
      attributes: ["uid", "isAdminToken"],
      where: { token: authToken },
    }))!;

    const user = new User({
      uuid: uuidv4(),
      tokenUid: token.uid,
      id,
      password: bcrypt.hashSync(password, 10),
      name,
      isAdmin: token.isAdminToken,
    });
    await user.save();

    token.allocedUserUid = user.uid;

    await token.save();

    res.status(201).end();
  }
);

accountRouter.get("/", query("uuid").isUUID().optional(), async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    res.status(400).error({
      error: "INVALID_UUID",
      message: "Uuid is not in correct format.",
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
        error: "USER_SPECIFIC_UNABLE",
        message: "You must be logged in or provide id.",
      });
      break;
    case null:
      res.status(404).error({
        error: "USER_NOT_FOUND",
        message: "The requested user does not exist.",
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

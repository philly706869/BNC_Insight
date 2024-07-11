import bcrypt from "bcrypt";
import { Router } from "express";
import { body, query } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import { AuthToken } from "../../model/AuthToken.js";
import { User } from "../../model/User.js";
import { validationHandler } from "../validationHandler.js";
import { authRouter } from "./auth.js";
import { loginRouter } from "./login.js";
import { logoutRouter } from "./logout.js";

export const accountRouter = Router();

accountRouter.use("/auth", authRouter);
accountRouter.use("/login", loginRouter);
accountRouter.use("/logout", logoutRouter);

accountRouter.post(
  "/",
  body("token")
    .exists()
    .withMessage({
      error: "TOKEN_NOT_PROVIDED",
      message: "You must provide `token`.",
    })
    .bail()
    .isString()
    .withMessage({
      error: "INVALID_TOKEN_TYPE",
      message: "`token` must be string.",
    })
    .custom(async (value: string, { req }) => {
      const token = await AuthToken.findIfAllocable(value);
      if (!token)
        throw { error: "INVALID_TOKEN", message: "Token not exists." };
      req.body.authToken = token;
    }),
  body("id")
    .exists()
    .withMessage({
      error: "ID_NOT_PROVIDED",
      message: "You must provide `id`.",
    })
    .bail()
    .isString()
    .withMessage({
      error: "INVALID_ID_TYPE",
      message: "`id` must be string.",
    }),
  body("password")
    .exists()
    .withMessage({
      error: "PASSWORD_NOT_PROVIDED",
      message: "You must provide `password`.",
    })
    .bail()
    .isString()
    .withMessage({
      error: "INVALID_PASSWORD_TYPE",
      message: "`password` must be string.",
    }),
  body("name")
    .exists()
    .withMessage({
      error: "NAME_NOT_PROVIDED",
      message: "You must provide `name`.",
    })
    .bail()
    .isString()
    .withMessage({
      error: "INVALID_NAME_TYPE",
      message: "`name` must be string.",
    }),
  validationHandler,
  async (req, res) => {
    const {
      authToken,
      id,
      password,
      name,
    }: {
      authToken: AuthToken;
      id: string;
      password: string;
      name: string;
    } = req.body;

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
  }
);

accountRouter.get(
  "/",
  query("uuid")
    .exists()
    .withMessage({
      error: "UUID_NOT_PROVIDED",
      message: "You must provide `uuid`.",
    })
    .bail()
    .isUUID()
    .withMessage({
      error: "INVALID_UUID_FORMAT",
      message: "`uuid` is not in correct format.",
    })
    .optional(),
  validationHandler,
  async (req, res) => {
    const queryUUID = req.query.uuid as string;
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
  }
);

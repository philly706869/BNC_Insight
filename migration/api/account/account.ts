import bcrypt from "bcrypt";
import { Router } from "express";
import Joi from "joi";
import { AuthToken } from "../../model/AuthToken.js";
import { User } from "../../model/User.js";
import { logger } from "../../util/logger.js";
import { authRouter } from "./auth.js";
import { loginRouter } from "./login.js";
import { logoutRouter } from "./logout.js";

export const accountRouter = Router();

accountRouter.use(`/auth`, authRouter);
accountRouter.use(`/login`, loginRouter);
accountRouter.use(`/logout`, logoutRouter);

const bodySchema = Joi.object<{
  token: AuthToken;
  id: string;
  password: string;
  name: string;
}>({
  token: Joi.string()
    .allow(``)
    .required()
    .external(async (value: string, helper) => {
      const valid = AuthToken.validateToken(value);
      if (!valid) return helper.message({});

      const authToken = await AuthToken.findOne({ where: { token: value } });
      if (!authToken || authToken.allocedUserUid !== null)
        return helper.message({});

      return authToken;
    }),
  id: Joi.string()
    .allow(``)
    .required()
    .external(async (value: string, helper) => {
      const errors = User.validateId(value);
      if (errors) helper.message({});

      const user = await User.findOne({ where: { id: value } });
      if (user) return helper.message({});

      return value;
    }),
  password: Joi.string()
    .allow(``)
    .required()
    .external(async (value: string, helper) => {
      const errors = User.validatePassword(value);
      if (errors) return helper.message({});

      return value;
    }),
  name: Joi.string()
    .allow(``)
    .required()
    .external(async (value: string, helper) => {
      const errors = User.validateName(value);
      if (errors) return helper.message({});

      return value;
    }),
}).unknown(true);

accountRouter.post(`/`, async (req, res) => {
  try {
    const { token, id, password, name } = await bodySchema.validateAsync(
      req.body
    );

    const user = await User.create({
      id,
      password: bcrypt.hashSync(password, 10),
      name,
      isAdmin: token.isAdminToken,
    });

    await token.update({
      allocedUserUid: user.uid,
    });

    res.status(201).end();
  } catch (error) {
    if (Joi.isError(error)) res.status(400).end();
    else {
      logger.error(error);
      res.status(500).end();
    }
  }
});

const querySchema = Joi.object<{ uuid: string | undefined }>({
  uuid: Joi.string().uuid().optional(),
}).unknown(true);

accountRouter.get(`/`, async (req, res) => {
  try {
    const { uuid } = await querySchema.validateAsync(req.query);
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
  } catch (error) {
    if (Joi.isError(error)) res.status(400).end();
    else {
      logger.error(error);
      res.status(500).end();
    }
  }
});

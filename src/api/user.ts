import { Router } from "express";
import { query, validationResult } from "express-validator";
import { User } from "../model/User.js";
export const userRouter = Router();

userRouter.get("/", query("uuid").isUUID().optional(), async (req, res) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    res.status(400).json({
      error: "INVALID_UUID",
      message: "Uuid is not in correct format.",
    });
    return;
  }

  const queryUUID: string | undefined = req.query!!.uuid;
  const requestUID = req.session.user?.uid;

  const selector = queryUUID
    ? async function () {
        return await User.findOne({ where: { uuid: queryUUID } });
      }
    : requestUID
    ? async function () {
        return await User.findByPk(requestUID);
      }
    : null;

  if (!selector) {
    res.status(400).json({
      error: "USER_SPECIFIC_UNABLE",
      message: "You must be logged in or provide uuid.",
    });
    return;
  }

  const user = await selector();

  if (!user) {
    res.status(404).json({
      error: "USER_NOT_FOUND",
      message: "The requested user does not exist.",
    });
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

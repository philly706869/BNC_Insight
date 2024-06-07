import { Router } from "express";
import { query, validationResult } from "express-validator";
import { User } from "../model/User.js";

export const userRouter = Router();

userRouter.get("/", query("uuid").isUUID().optional(), async (req, res) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    res.status(400).json({ error: "Invalid uuid." });
    return;
  }

  const queryUUID: string | undefined = req.query!!.uuid;
  const requestUID = req.session.user?.uid;

  if (queryUUID) {
    const user = await User.findOne({ where: { uuid: queryUUID } });
    if (!user) {
      res.status(404).end();
      return;
    }
    res.status(200).json({
      uuid: user.uuid,
      name: user.name,
      isAdmin: user.isAdmin,
    });
    return;
  }

  if (requestUID !== undefined) {
    const user = (await User.findByPk(requestUID))!!;
    res.status(200).json({
      uuid: user.uuid,
      name: user.name,
      isAdmin: user.isAdmin,
    });
    return;
  }

  res.status(404).end();
});

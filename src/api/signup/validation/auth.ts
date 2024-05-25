import express from "express";
import { AuthToken } from "../../../model/AuthToken.js";

export default express
  .Router()
  .get("/auth", express.text({ type: "*/*" }), async (req, res) => {
    const payload = req.body;
    if (typeof payload !== "string") {
      res.status(400).json({ error: "invalid payload" });
      return;
    }

    const authToken = await AuthToken.findOne({ where: { token: req.body } });
    res
      .status(200)
      .json(authToken !== null && authToken.allocedUserUid === null);
  });

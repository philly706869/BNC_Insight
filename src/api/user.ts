import express from "express";

export const user = express.Router();

user.get("/", (req, res) => {
  if (!req.session.userUid) {
  }
});

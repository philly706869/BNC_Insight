import express from "express";
import path from "path";

export const mainRouter = express.Router();

mainRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/home.html"));
});

export default mainRouter;

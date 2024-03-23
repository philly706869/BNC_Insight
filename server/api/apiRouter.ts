import express from "express";

export const apiRouter = express.Router();

apiRouter.get("/", (req, res, next) => {
  res.send("api root");
});

export default apiRouter;

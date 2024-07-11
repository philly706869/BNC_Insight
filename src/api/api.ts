import { Router } from "express";
import { body, matchedData } from "express-validator";
import { accountRouter } from "./account/account.js";
import { articleRouter } from "./article.js";
import { categoriesRouter } from "./categories.js";

export const apiRouter = Router();

apiRouter.use("/account", accountRouter);
apiRouter.use("/article", articleRouter);
apiRouter.use("/categories", categoriesRouter);

apiRouter.post(
  "/test",
  body("test")
    .isNumeric()
    .bail()
    .custom(async (value) => {
      return Promise.reject();
    }),
  (req, res) => {
    res.json({ body: req.body, data: matchedData(req) });
  }
);

import express from "express";
import config from "../../../config/config.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import defaultPool from "../../defaultPool.js";

export const apiRouter = express.Router();

apiRouter.use(cookieParser(config.cookieSecret));

apiRouter.get("/users", (req, res) => {
  defaultPool.getConnection((error, connection) => {
    if (error) throw error;
    connection.query("select * from user", (error, results, fields) => {
      if (error) res.status(400).send(error);
      res.send(results);
    });
    connection.release();
  });
});

apiRouter.post("/login", express.urlencoded({ extended: true }), (req, res) => {
  //res.cookie()
  res.redirect("/");
});

export default apiRouter;

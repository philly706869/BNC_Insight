import express from "express";
import config from "../configs/serverConfig.js";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

export const apiRouter = express.Router();

apiRouter.use(cookieParser(config.cookieSecret));

apiRouter.get("/users", (req, res) => {
  config.dbPool.getConnection((error, connection) => {
    if (error) throw error;
    connection.query("select * from user", (error, results, fields) => {
      if (error) res.status(400).send(error);
      res.send(results);
    });
    connection.release();
  });
});

apiRouter.post("/", (req, res) => {});

export default apiRouter;

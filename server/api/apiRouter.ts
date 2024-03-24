import express from "express";
import config from "../../config";
import jwt from "jsonwebtoken";

export const apiRouter = express.Router();

apiRouter.get("/users", (req, res) => {
  const connection = config.dbconnection;

  connection.connect();
  connection.query("select * from users", (error, results, fields) => {
    if (error) res.status(400).send(error);
    res.send(results);
  });
  connection.end();
});

apiRouter.post("/", (req, res) => {});

export default apiRouter;

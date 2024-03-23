import express from "express";
import connection from "./connection.js";

export const apiRouter = express.Router();

apiRouter.get("/users", (req, res, next) => {
  connection.connect();

  connection.query("select * from users", (error, results, fields) => {
    if (error) {
      res.status(400).send(error);
    }
    res.send(results);
  });

  connection.end();
});

export default apiRouter;

import express from "express";
import defaultPool from "../../defaultPool.js";

export const apiRouter = express.Router();

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

export default apiRouter;

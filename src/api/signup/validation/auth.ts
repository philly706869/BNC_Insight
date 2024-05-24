import express from "express";
import pool from "../../../util/connectionPool.js";

export default express
  .Router()
  .get("/auth", express.text(), async (req, res) => {
    const connection = await pool.getConnection();

    const [result, field] = await connection.query(
      "SELECT EXISTS(SELECT 1 FROM `AUTH_TOKEN` WHERE USED=0 AND TOKEN=?)"
    );

    connection.release();
  });

import express from "express";
import pool from "../../../resource/connectionPool.js";

export default express.Router().get("/auth", async (req, res) => {
  const connection = await pool.getConnection();
});

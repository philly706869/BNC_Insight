import express from "express";

export default express
  .Router()
  .get("/auth", express.text(), async (req, res) => {});

import { Router } from "express";

export const router = Router();

router.post("/", (req, res) => {
  res.status(501).end();
});

router.get("/", (req, res) => {
  res.status(501).end();
});

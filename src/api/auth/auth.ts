import express from "express";
import { id } from "./id.js";
import { token } from "./token.js";

export const auth = express.Router();

auth.use("/signup/id", id);
auth.use("/signup/token", token);

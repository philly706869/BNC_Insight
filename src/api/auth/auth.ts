import express from "express";
import { id } from "./id.js";
import { name } from "./name.js";
import { password } from "./password.js";
import { token } from "./token.js";

export const auth = express.Router();

auth.use("/signup/token", token);
auth.use("/signup/id", id);
auth.use("/signup/password", password);
auth.use("/signup/name", name);

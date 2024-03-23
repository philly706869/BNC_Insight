import express from "express";
import config from "../config.js";
import path from "path";
import apiRouter from "./api/apiRouter.js";

const app = express();

config.static.forEach((item) => app.use(item.route, express.static(item.dir))); // add static middleware

app.get("/", (req, res) => {
  res.sendFile(path.join(config.__dirname, "/public/home.html"));
});

app.use(config.apiRoute, apiRouter); // use apiRouter for api

app.listen(config.port, () => {
  console.log(`server started on port: ${config.port}`);
});

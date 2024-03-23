import express from "express";
import config from "../config";
import path from "path";
import apiRouter from "./api/apiRouter";

__dirname = path.join(__dirname, ".."); // set default path: project path

const app = express();

config.static.forEach((item) => app.use(item.route, express.static(item.dir))); // add static middleware

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/home.html"));
});

app.use(config.apiRoute, apiRouter); // use apiRouter for api

app.listen(config.port, () => {
  console.log(`server started on port: ${config.port}`);
});

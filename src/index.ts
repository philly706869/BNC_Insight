import express from "express";
import http from "http";
import config from "./config/server.config.js";
import api from "./api/api.js";
import logger from "./resource/logger.js";
import path from "path";
import __dirname from "./resource/__dirname.js";

const app = express();

app.use("/static", express.static(path.join(__dirname, "./public/static")));
app.use("/api", api);
app.use(
  "/",
  express.static(path.join(__dirname, "./public/page"), {
    extensions: ["html", "htm"],
  })
);

const server = http.createServer(app);

server.listen(config.port, () => {
  logger.info(`http server started listening on port ${config.port}`);
});

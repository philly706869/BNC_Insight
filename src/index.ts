import express from "express";
import http from "http";
import config from "./config/server.config.js";
import api from "./api/api.js";
import logger from "./util/logger.js";
import path from "path";
import { path as approot } from "./util/appRootPath.js";

const app = express();

app.use("/static", express.static(path.join(approot, "./public/static")));
app.use("/api", api);
app.use(
  "/",
  express.static(path.join(approot, "./public/page"), {
    extensions: ["html", "htm"],
  })
);

const server = http.createServer(app);

server.listen(config.port, () => {
  logger.info(`http server started listening on port ${config.port}`);
});

import conf from "./config/database.config.js";
console.log(conf);

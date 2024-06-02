import express from "express";
import http from "http";
import { config } from "./config/server.config.js";
import { api } from "./api/api.js";
import { logger } from "./util/logger.js";
import path from "path";
import { __dirname } from "./util/__dirname.js";
import { sequelize } from "./model/sequelize.js";

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

server.listen(config.port, async () => {
  logger.info(`http server started listening on port ${config.port}`);

  try {
    await sequelize.sync();
    logger.info("database sync succeed");
  } catch (error) {
    logger.error(error);
  }
});

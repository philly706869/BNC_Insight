import express from "express";
import expressSession from "express-session";
import http from "http";
import path from "path";
import { apiRouter } from "./api/api.js";
import { config as serverConfig } from "./config/server.config.js";
import { sequelize } from "./model/sequelize.js";
import { userRouter } from "./user/user.js";
import { __dirname } from "./util/__dirname.js";
import { logger } from "./util/logger.js";

const app = express();

app.use(
  expressSession({
    secret: serverConfig.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 31,
    },
  })
);

declare module "express-session" {
  export interface SessionData {
    user: {
      uid: number;
      isAdmin: boolean;
    };
  }
}

app.use(express.json());
app.use("/api", apiRouter);
app.use("/user", userRouter);
app.use("/static", express.static(path.join(__dirname, "./public/static")));

const pagePath = path.join(__dirname, "./public/page");
const staticOption = {
  extensions: ["html", "htm"],
};

const privatePageProvider = express.static(
  path.join(pagePath, "./private"),
  staticOption
);
const protectedPageProvider = express.static(
  path.join(pagePath, "./protected"),
  staticOption
);
const publicPageProvider = express.static(
  path.join(pagePath, "./public"),
  staticOption
);

app.use((req, res, next) => {
  const { user } = req.session;
  if (user && user.isAdmin) privatePageProvider(req, res, next);
  else next();
});

app.use((req, res, next) => {
  const { user } = req.session;
  if (user) protectedPageProvider(req, res, next);
  else next();
});

app.use(publicPageProvider);

app.use((req, res) => {
  res.sendFile(path.join(pagePath, "./404.html"));
});

const server = http.createServer(app);

server.listen(serverConfig.port, async () => {
  logger.info(`http server started listening on port ${serverConfig.port}`);

  try {
    await sequelize.sync();
    logger.info("database sync succeed");
  } catch (error) {
    logger.error(error);
  }
});

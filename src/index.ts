import ConnectSessionSequelize from "connect-session-sequelize";
import express, { NextFunction, Request, Response } from "express";
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

const SequqlizeStore = ConnectSessionSequelize(expressSession.Store);

app.use(
  expressSession({
    secret: serverConfig.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 31,
    },
    store: new SequqlizeStore({ db: sequelize }),
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
app.use("/static", express.static(path.join(__dirname, "./public")));

app.set("view engine", "ejs");

const access = {
  user: (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.session;
    if (user) next();
    else res.status(404).end();
  },
  admin: (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.session;
    if (user && user.isAdmin) next();
    else res.status(404).end();
  },
};

function renderer(options: {
  title: string;
  script: string;
  component: string;
}) {
  return (req: Request, res: Response) => {
    res.render("template", options);
  };
}

app.get(
  "/",
  renderer({
    title: "BNC_Insight",
    script: "index.js",
    component: "x-index",
  })
);

app.get(
  "/user",
  access.user,
  renderer({
    title: "BNC_Insight User",
    script: "user.js",
    component: "x-user",
  })
);

app.get(
  "/article/new",
  access.user,
  renderer({
    title: "BNC_Insight New Article",
    script: "article/new.js",
    component: "x-new-article",
  })
);

app.get(
  "/article/edit/\\d+",
  access.user,
  renderer({
    title: "BNC_Insight Edit Article",
    script: "article/edit.js",
    component: "x-edit-article",
  })
);

app.get(
  "/article/\\d+",
  renderer({
    title: "BNC_Insight Article",
    script: "article/view.js",
    component: "x-view-article",
  })
);

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

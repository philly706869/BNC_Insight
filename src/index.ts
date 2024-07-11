import ConnectSessionSequelize from "connect-session-sequelize";
import express, { NextFunction, Request, Response } from "express";
import expressSession from "express-session";
import http from "http";
import Joi from "joi";
import path from "path";
import { apiRouter } from "./api/api.js";
import { config as serverConfig } from "./config/server.config.js";
import { Category } from "./model/Category.js";
import { sequelize } from "./model/sequelize.js";
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

app.use(express.json());
app.use("/api", apiRouter);
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

const categorySchema = Joi.object<{ name: string }>({
  name: Joi.string()
    .external(async (value: string, helper) => {
      if (Category.validateName(value) !== null) return helper.message({});
      if ((await Category.findByPk(value)) === null) return helper.message({});
      return value;
    })
    .required(),
});

app.get(
  "/category",
  async (req, res, next) => {
    try {
      await categorySchema.validateAsync(req.query);
      next();
    } catch (error) {
      res.status(404).end();
    }
  },
  renderer({
    title: "BNC_Insight User",
    script: "user.js",
    component: "x-user",
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
  "/articles",
  access.user,
  renderer({
    title: "BNC_Insight Articles",
    script: "article/list.js",
    component: "x-article-list",
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

try {
  await sequelize.sync();
  logger.info("Database successfully synced");

  server.listen(serverConfig.port, async () => {
    logger.info(`Http server started listening on port ${serverConfig.port}`);
  });
} catch (error) {
  logger.error(error);
  logger.error("Failed to start server");
}

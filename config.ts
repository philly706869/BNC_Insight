import path from "path";
import Config from "./config.declare";
import mysql from "mysql2";
import fs from "fs";

export const config: Config = {
  port: 3000,
  static: [
    {
      dir: path.join(__dirname, "/public/static"),
      route: "/static",
    },
  ],
  apiRoute: "/api",
  dbconnection: mysql.createConnection({
    host: "localhost",
    database: "news",
    user: "root",
    password: (() => {
      const secret = fs.readFileSync("secret", "utf-8");
      return Buffer.from(secret, "base64").toString("utf8");
    })(),
  }),
};

export default config;

import Config from "./config.declare";
import path from "path";

export const config: Config = {
  port: 3000,
  static: [
    {
      dir: path.join(__dirname, "/public/static"),
      route: "/static",
    },
  ],
  apiRoute: "/api",
  database: {
    host: "",
  },
};

export default config;

export type Config = {
  port: number;
  static: {
    dir: string;
    route: string;
  }[];
  apiRoute: string;
  database: {
    host: string;
  };
};

export default Config;

import { EmailConfig, path, schema } from "./declare/email.config.declare.js";
import getConfig from "./configProvider.js";

const object = await getConfig(path, schema);

export const config: EmailConfig = {
  service: object.service,
  auth: {
    user: object.auth.user,
    pass: object.auth.pass,
  },
};

export default config;

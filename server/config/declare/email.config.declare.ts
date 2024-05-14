import { join } from "path";
import configPath from "./config.path.js";
import joi from "joi";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

export const path = join(configPath, "email.json");

export const schema = joi.object({
  service: joi.string().required(),
  auth: joi
    .object({
      user: joi.string().required(),
      pass: joi.string().required(),
    })
    .required(),
});

export type EmailConfig = SMTPTransport.Options & {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
};

export default EmailConfig;

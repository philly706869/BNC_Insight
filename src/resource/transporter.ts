import mailer from "nodemailer";
import config from "../config/email.config.js";

export const transporter = mailer.createTransport(config);

export default transporter;

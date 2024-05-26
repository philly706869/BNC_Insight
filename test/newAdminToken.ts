import { sequelize, AuthToken } from "../src/model/sequelize.js";

await sequelize.sync();
const newToken = new AuthToken({
  token: "testadmin",
  allocedUserUid: null,
  isAdminToken: true,
});
newToken.save();

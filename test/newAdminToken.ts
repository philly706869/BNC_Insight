import { sequelize, AuthToken } from "../src/model/sequelize.js";

await sequelize.sync({ logging: true });
const newToken = new AuthToken({
  token: "testadmin",
  allocedUserUid: null,
  isAdminToken: true,
});
newToken.save({ logging: true });

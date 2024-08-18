import { AuthToken } from "@/api/database/models/AuthToken";
import { dirname } from "@/utils/dirname";
import { config } from "dotenv";
import path from "path";
import { exit } from "process";

config({ path: path.join(dirname, ".env.local") });
const { dataSource } = await import("./src/api/database/dataSource");
await dataSource.initialize();

const token = "admin";
const isAdminToken = true;

if (!AuthToken.validateToken(token)) {
  console.error("incorrect token");
  exit(1);
}

const authToken = AuthToken.create({
  token,
  isAdminToken,
});

await authToken.save();
exit(0);

import pool from "../util/connectionPool.js";

export const AuthTokenCollection = Object.freeze({
  async validate(token: string) {
    const connection = await pool.getConnection();

    connection.query("SELECT * ", []);

    connection.release();

    return false;
  },
});

export default AuthTokenCollection;

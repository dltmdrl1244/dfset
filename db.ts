import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1244",
  database: process.env.DB_DATABASE || "test",
  connectionLimit: 10,
  timezone: "Asia/Seoul",
  dateStrings: true,
});

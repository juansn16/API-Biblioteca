import mysql from 'mysql2/promise';
import { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } from "./env.js"

export const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

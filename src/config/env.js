import dotenv from 'dotenv';
dotenv.config();

export const {
  PORT = 3000,
  DB_HOST = '127.0.0.1',
  DB_PORT = 3306,
  DB_NAME = 'biblioteca',
  DB_USER = 'root',
  DB_PASS = '',
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN = '15m',
  REFRESH_TOKEN_EXPIRES_IN = '7d'
} = process.env;
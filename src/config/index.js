require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev-insecure-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgres://taskflow:taskflow@localhost:5432/taskflow',
};

module.exports = config;

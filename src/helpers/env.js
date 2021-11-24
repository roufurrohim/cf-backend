require("dotenv").config();

const env = {
  HOST: process.env.HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  KEY_SECRET: process.env.KEY_SECRET,
  REDIS_HOSTNAME: process.env.REDIS_HOSTNAME,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};

module.exports = env;

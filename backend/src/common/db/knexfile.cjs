const config = require("dotenv");
const join  = require('path');

config.config({
  path: join.join(__dirname, '.env')
});

console.log("envs", process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_HOST, process.env.DB_PORT, process.env.DB_NAME);

const dbConfig = {
  development: {
    client: "pg",
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      port: Number(process.env.DB_PORT),
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST
    },
    pool: {
      min: 0,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds',
    },
  },
  production: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: true
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: './migrations'
    },
    seeds: {
      directory: './seeds',
    },
  }
};

module.exports = dbConfig;
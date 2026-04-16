const knex = require("knex");
const path = require("path");
require("dotenv").config();

const client = process.env.DATABASE_CLIENT || "sqlite3";

const config = {
  client,
  connection:
    client === "sqlite3"
      ? {
          filename:
            process.env.DATABASE_FILENAME ||
            path.resolve(__dirname, "../dev.sqlite3"),
        }
      : process.env.DATABASE_URL,
  useNullAsDefault: true,
};

const db = knex(config);

module.exports = db;

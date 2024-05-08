const pg = require("pg");
require("dotenv").config();
const _pgPool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

module.exports = {
  query: (text, params) => _pgPool.query(text, params),
};

module.exports = _pgPool;

const db = require("./db-postgress");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pgPool = db;

const pgSessionStore = new pgSession({
  pool: pgPool,
  tableName: "sessions",
});

module.exports = {
  query: (text, params) => pgPool.query(text, params),
};

module.exports = pgPool;
module.exports = pgSessionStore;

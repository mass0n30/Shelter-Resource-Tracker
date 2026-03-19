const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.DATABASE_URL,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});


module.exports = pool;
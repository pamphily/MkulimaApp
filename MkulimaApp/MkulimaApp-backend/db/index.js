const { Pool } = require('pg');
require('dotenv').config();

// Debug: log the env variables
console.log("🌍 DB_HOST:", process.env.DB_HOST);
console.log("🔐 DB_PASSWORD:", process.env.DB_PASSWORD, typeof process.env.DB_PASSWORD);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL');
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection error:', err);
  });

module.exports = pool;

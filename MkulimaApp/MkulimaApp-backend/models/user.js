const { Pool } = require('pg');
const pool = require('../db');

const createUser = async ({ name, email, phone, password, role }) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO users (name, email, phone, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email, phone, password, role]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

const findUserByEmail = async (email) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

// ✅ Add this to support GET /user/profile
const findUserById = async (id) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, name, email, phone, role, created_at
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById, // <-- important!
};

const pool = require('../db/pool');

const PUBLIC_FIELDS = 'id, name, email, created_at';

async function create({ name, email, passwordHash }) {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING ${PUBLIC_FIELDS}`,
    [name, email, passwordHash]
  );
  return rows[0];
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function findByEmailWithHash(email) {
  const { rows } = await pool.query(
    `SELECT id, name, email, password_hash, created_at
       FROM users WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

async function update(id, { name, email }) {
  const { rows } = await pool.query(
    `UPDATE users
        SET name  = COALESCE($2, name),
            email = COALESCE($3, email)
      WHERE id = $1
      RETURNING ${PUBLIC_FIELDS}`,
    [id, name ?? null, email ?? null]
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = {
  create,
  findById,
  findByEmailWithHash,
  update,
  remove,
};

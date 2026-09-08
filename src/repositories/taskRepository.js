const pool = require('../db/pool');

const FIELDS =
  'id, title, description, status, priority, user_id, created_at, updated_at';

async function create({ title, description, status, priority, userId }) {
  const { rows } = await pool.query(
    `INSERT INTO tasks (title, description, status, priority, user_id)
     VALUES ($1, $2, COALESCE($3, 'a_fazer'), COALESCE($4, 'media'), $5)
     RETURNING ${FIELDS}`,
    [title, description ?? null, status ?? null, priority ?? null, userId]
  );
  return rows[0];
}

async function listByUser(userId, { status, priority } = {}) {
  const clauses = ['user_id = $1'];
  const params = [userId];

  if (status) {
    params.push(status);
    clauses.push(`status = $${params.length}`);
  }
  if (priority) {
    params.push(priority);
    clauses.push(`priority = $${params.length}`);
  }

  const { rows } = await pool.query(
    `SELECT ${FIELDS} FROM tasks
      WHERE ${clauses.join(' AND ')}
      ORDER BY created_at DESC, id DESC`,
    params
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT ${FIELDS} FROM tasks WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function update(id, { title, description, status, priority }) {
  const { rows } = await pool.query(
    `UPDATE tasks
        SET title       = COALESCE($2, title),
            description  = COALESCE($3, description),
            status       = COALESCE($4, status),
            priority     = COALESCE($5, priority),
            updated_at   = now()
      WHERE id = $1
      RETURNING ${FIELDS}`,
    [id, title ?? null, description ?? null, status ?? null, priority ?? null]
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = {
  create,
  listByUser,
  findById,
  update,
  remove,
};

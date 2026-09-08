const pool = require('./pool');

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'a_fazer'
    CHECK (status IN ('a_fazer', 'em_andamento', 'concluida')),
  priority VARCHAR(10) NOT NULL DEFAULT 'media'
    CHECK (priority IN ('baixa', 'media', 'alta')),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
`;

async function migrate() {
  await pool.query(SQL);
}

if (require.main === module) {
  migrate()
    .then(() => {
      console.log('Migrations applied successfully.');
      return pool.end();
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exitCode = 1;
      return pool.end();
    });
}

module.exports = migrate;

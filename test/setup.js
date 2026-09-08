const pool = require('../src/db/pool');
const migrate = require('../src/db/migrate');

// The integration tests need a real PostgreSQL database.
// Locally:  docker compose up -d db
// In CI:    provided by the `postgres` service container.
beforeAll(async () => {
  await migrate();
});

beforeEach(async () => {
  await pool.query('TRUNCATE tasks, users RESTART IDENTITY CASCADE');
});

afterAll(async () => {
  await pool.end();
});

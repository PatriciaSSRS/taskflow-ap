const app = require('./app');
const config = require('./config');
const migrate = require('./db/migrate');
const pool = require('./db/pool');

async function start() {
  try {
    await migrate();
    app.listen(config.port, () => {
      console.log(`TaskFlow API listening on port ${config.port} (${config.env})`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    await pool.end();
    process.exit(1);
  }
}

start();

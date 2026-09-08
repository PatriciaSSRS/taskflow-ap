const HttpError = require('../utils/httpError');

// Express identifies error handlers by their arity (4 args), so `_next` must stay.
module.exports = function errorHandler(err, req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }

  // Unique-violation from PostgreSQL (e.g. duplicate email) as a safety net.
  if (err && err.code === '23505') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
};

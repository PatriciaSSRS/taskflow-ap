const HttpError = require('./httpError');

module.exports = function parseId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'Invalid id parameter');
  }
  return id;
};

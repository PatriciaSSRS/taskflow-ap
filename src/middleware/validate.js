const HttpError = require('../utils/httpError');

/**
 * Validates `data` against a zod schema, returning the parsed value.
 * Throws an HttpError(400) with a readable message when validation fails.
 */
function parseOrThrow(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`)
      .join('; ');
    throw new HttpError(400, `Validation failed - ${details}`);
  }
  return result.data;
}

module.exports = { parseOrThrow };

const authService = require('../services/authService');
const { parseOrThrow } = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validation/schemas');

async function register(req, res, next) {
  try {
    const data = parseOrThrow(registerSchema, req.body);
    const user = await authService.register(data);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const data = parseOrThrow(loginSchema, req.body);
    const result = await authService.login(data);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };

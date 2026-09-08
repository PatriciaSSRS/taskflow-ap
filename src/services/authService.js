const userRepository = require('../repositories/userRepository');
const { hashPassword, verifyPassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const HttpError = require('../utils/httpError');

async function register({ name, email, password }) {
  const existing = await userRepository.findByEmailWithHash(email);
  if (existing) {
    throw new HttpError(409, 'Email already registered');
  }

  const passwordHash = await hashPassword(password);
  return userRepository.create({ name, email, passwordHash });
}

async function login({ email, password }) {
  const user = await userRepository.findByEmailWithHash(email);
  if (!user) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const token = signToken({ sub: user.id, email: user.email });
  return { token };
}

module.exports = { register, login };

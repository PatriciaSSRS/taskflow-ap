const request = require('supertest');
const app = require('../src/app');

let counter = 0;

/**
 * Registers a fresh user and logs in, returning the created user, a valid
 * JWT and the raw credentials used.
 */
async function createUserAndLogin(overrides = {}) {
  counter += 1;
  const payload = {
    name: 'Test User',
    email: `user${Date.now()}_${counter}@example.com`,
    password: 'supersecret',
    ...overrides,
  };

  const registerRes = await request(app)
    .post('/api/auth/register')
    .send(payload);

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: payload.email, password: payload.password });

  return {
    user: registerRes.body,
    token: loginRes.body.token,
    credentials: payload,
  };
}

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

module.exports = { app, request, createUserAndLogin, authHeader };

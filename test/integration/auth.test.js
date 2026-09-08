const { request, app, createUserAndLogin } = require('../helpers');

describe('Auth', () => {
  it('registers a new user and never returns the password hash', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'supersecret',
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Alice', email: 'alice@example.com' });
    expect(res.body.password_hash).toBeUndefined();
    expect(res.body.id).toEqual(expect.any(Number));
  });

  it('rejects a duplicate email with 409', async () => {
    const payload = {
      name: 'Bob',
      email: 'bob@example.com',
      password: 'supersecret',
    };
    await request(app).post('/api/auth/register').send(payload);
    const res = await request(app).post('/api/auth/register').send(payload);
    expect(res.status).toBe(409);
  });

  it('rejects an invalid registration payload with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: '', email: 'not-an-email', password: '123' });
    expect(res.status).toBe(400);
  });

  it('logs in with valid credentials and returns a JWT', async () => {
    const { token } = await createUserAndLogin();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('rejects login with a wrong password', async () => {
    const { credentials } = await createUserAndLogin();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  it('rejects login for an unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ghost@example.com', password: 'whatever' });
    expect(res.status).toBe(401);
  });
});

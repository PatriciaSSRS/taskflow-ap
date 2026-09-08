const { request, app, createUserAndLogin, authHeader } = require('../helpers');

describe('Users', () => {
  it('returns the current user on GET /api/users/me', async () => {
    const { token, user } = await createUserAndLogin();
    const res = await request(app)
      .get('/api/users/me')
      .set(authHeader(token));

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(user.id);
    expect(res.body.email).toBe(user.email);
  });

  it('rejects unauthenticated access with 401', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });

  it('rejects a malformed token with 401', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });

  it('updates the caller own account', async () => {
    const { token, user } = await createUserAndLogin();
    const res = await request(app)
      .put(`/api/users/${user.id}`)
      .set(authHeader(token))
      .send({ name: 'Renamed User' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Renamed User');
  });

  it('forbids updating someone else account with 403', async () => {
    const a = await createUserAndLogin();
    const b = await createUserAndLogin();
    const res = await request(app)
      .put(`/api/users/${b.user.id}`)
      .set(authHeader(a.token))
      .send({ name: 'Hacked' });

    expect(res.status).toBe(403);
  });

  it('deletes the caller own account', async () => {
    const { token, user } = await createUserAndLogin();
    const res = await request(app)
      .delete(`/api/users/${user.id}`)
      .set(authHeader(token));
    expect(res.status).toBe(204);
  });
});

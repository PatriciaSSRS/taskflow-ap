const { request, app, createUserAndLogin, authHeader } = require('../helpers');

async function auth() {
  const { token } = await createUserAndLogin();
  return authHeader(token);
}

describe('Tasks', () => {
  it('creates a task with default status and priority', async () => {
    const headers = await auth();
    const res = await request(app)
      .post('/api/tasks')
      .set(headers)
      .send({ title: 'First task' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: 'First task',
      status: 'a_fazer',
      priority: 'media',
    });
  });

  it('validates the task payload with 400', async () => {
    const headers = await auth();
    const res = await request(app)
      .post('/api/tasks')
      .set(headers)
      .send({ title: '' });
    expect(res.status).toBe(400);
  });

  it('requires authentication', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'x' });
    expect(res.status).toBe(401);
  });

  it('lists only the tasks that belong to the caller', async () => {
    const a = await createUserAndLogin();
    const b = await createUserAndLogin();

    await request(app)
      .post('/api/tasks')
      .set(authHeader(a.token))
      .send({ title: 'A task' });
    await request(app)
      .post('/api/tasks')
      .set(authHeader(b.token))
      .send({ title: 'B task' });

    const res = await request(app)
      .get('/api/tasks')
      .set(authHeader(a.token));

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('A task');
  });

  it('filters tasks by status and by priority', async () => {
    const headers = await auth();
    await request(app)
      .post('/api/tasks')
      .set(headers)
      .send({ title: 'todo low', priority: 'baixa' });
    await request(app)
      .post('/api/tasks')
      .set(headers)
      .send({ title: 'done high', status: 'concluida', priority: 'alta' });

    const byStatus = await request(app)
      .get('/api/tasks?status=concluida')
      .set(headers);
    expect(byStatus.body).toHaveLength(1);
    expect(byStatus.body[0].title).toBe('done high');

    const byPriority = await request(app)
      .get('/api/tasks?priority=baixa')
      .set(headers);
    expect(byPriority.body).toHaveLength(1);
    expect(byPriority.body[0].title).toBe('todo low');
  });

  it('rejects an invalid filter value with 400', async () => {
    const headers = await auth();
    const res = await request(app)
      .get('/api/tasks?status=weird')
      .set(headers);
    expect(res.status).toBe(400);
  });

  it('updates a task, moving it through statuses', async () => {
    const headers = await auth();
    const created = await request(app)
      .post('/api/tasks')
      .set(headers)
      .send({ title: 'WIP' });

    const res = await request(app)
      .put(`/api/tasks/${created.body.id}`)
      .set(headers)
      .send({ status: 'em_andamento' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('em_andamento');
  });

  it('does not expose another user task (404)', async () => {
    const a = await createUserAndLogin();
    const b = await createUserAndLogin();

    const created = await request(app)
      .post('/api/tasks')
      .set(authHeader(a.token))
      .send({ title: 'secret' });

    const res = await request(app)
      .get(`/api/tasks/${created.body.id}`)
      .set(authHeader(b.token));

    expect(res.status).toBe(404);
  });

  it('deletes a task', async () => {
    const headers = await auth();
    const created = await request(app)
      .post('/api/tasks')
      .set(headers)
      .send({ title: 'delete me' });

    const del = await request(app)
      .delete(`/api/tasks/${created.body.id}`)
      .set(headers);
    expect(del.status).toBe(204);

    const get = await request(app)
      .get(`/api/tasks/${created.body.id}`)
      .set(headers);
    expect(get.status).toBe(404);
  });
});

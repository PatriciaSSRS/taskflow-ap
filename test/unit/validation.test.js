const {
  createTaskSchema,
  updateTaskSchema,
  registerSchema,
  taskFilterSchema,
} = require('../../src/validation/schemas');

describe('validation schemas', () => {
  it('accepts a valid task payload', () => {
    const parsed = createTaskSchema.parse({ title: 'Buy milk', priority: 'alta' });
    expect(parsed.title).toBe('Buy milk');
  });

  it('rejects a task without a title', () => {
    expect(createTaskSchema.safeParse({ priority: 'alta' }).success).toBe(false);
  });

  it('rejects an invalid status value', () => {
    expect(
      createTaskSchema.safeParse({ title: 'x', status: 'nope' }).success
    ).toBe(false);
  });

  it('rejects an empty update payload', () => {
    expect(updateTaskSchema.safeParse({}).success).toBe(false);
  });

  it('rejects registration with a short password', () => {
    const res = registerSchema.safeParse({
      name: 'Ana',
      email: 'ana@example.com',
      password: 'short',
    });
    expect(res.success).toBe(false);
  });

  it('accepts an empty task filter', () => {
    expect(taskFilterSchema.safeParse({}).success).toBe(true);
  });
});

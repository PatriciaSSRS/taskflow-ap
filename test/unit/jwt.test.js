const { signToken, verifyToken } = require('../../src/utils/jwt');

describe('jwt utils', () => {
  it('signs and verifies a token round-trip', () => {
    const token = signToken({ sub: 42, email: 'a@b.com' });
    const payload = verifyToken(token);
    expect(payload.sub).toBe(42);
    expect(payload.email).toBe('a@b.com');
  });

  it('produces a 3-part JWT string', () => {
    const token = signToken({ sub: 1 });
    expect(token.split('.')).toHaveLength(3);
  });

  it('throws on a tampered token', () => {
    const token = signToken({ sub: 1 });
    expect(() => verifyToken(`${token}tampered`)).toThrow();
  });
});

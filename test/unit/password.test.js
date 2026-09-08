const { hashPassword, verifyPassword } = require('../../src/utils/password');

describe('password utils', () => {
  it('hashes a password to a non-plaintext value', async () => {
    const hash = await hashPassword('mysecret123');
    expect(hash).not.toBe('mysecret123');
    expect(hash.length).toBeGreaterThan(20);
  });

  it('verifies a correct password', async () => {
    const hash = await hashPassword('mysecret123');
    await expect(verifyPassword('mysecret123', hash)).resolves.toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('mysecret123');
    await expect(verifyPassword('wrong-password', hash)).resolves.toBe(false);
  });
});

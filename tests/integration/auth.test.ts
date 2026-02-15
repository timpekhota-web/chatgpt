import { signAdminToken, verifyAdminToken } from '@/lib/auth';

describe('auth helpers', () => {
  it('signs and verifies admin token', () => {
    const token = signAdminToken({ role: 'admin', username: 'admin' });
    const payload = verifyAdminToken(token);

    expect(payload?.role).toBe('admin');
    expect(payload?.username).toBe('admin');
  });
});

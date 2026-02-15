import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export type AdminTokenPayload = {
  role: 'admin';
  username: string;
};

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
}

export function verifyAdminToken(token?: string): AdminTokenPayload | null {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | undefined {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  const cookieToken = req.cookies.get('admin_token')?.value;
  return cookieToken;
}

export function assertAdmin(req: NextRequest): AdminTokenPayload | null {
  const token = getTokenFromRequest(req);
  return verifyAdminToken(token);
}

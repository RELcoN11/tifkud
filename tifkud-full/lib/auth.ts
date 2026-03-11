import { prisma } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-change-me';
const COOKIE_NAME = 'admin_token';

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return false;
  return bcrypt.compare(password, admin.password);
}

export function createAdminToken(username: string): string {
  return jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyAdminToken(token: string): { username: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { username: string; role: string };
  } catch {
    return null;
  }
}

export async function getAdminFromCookie(): Promise<{ username: string } | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export { COOKIE_NAME };

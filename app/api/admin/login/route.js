import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

function sign(value) {
  return crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET || '').update(value).digest('hex');
}

export async function POST(request) {
  const { username, password } = await request.json().catch(() => ({}));
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!expectedUsername || !expectedPassword || !secret) {
    return NextResponse.json({ error: 'لم يتم إعداد بيانات Kadel admin السرية في Vercel بعد.' }, { status: 503 });
  }

  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' }, { status: 401 });
  }

  const expires = Date.now() + 1000 * 60 * 60 * 24 * 7;
  const value = `${expires}.${sign(String(expires))}`;
  const response = NextResponse.json({ ok: true });
  response.cookies.set('kadel_admin_session', value, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return response;
}

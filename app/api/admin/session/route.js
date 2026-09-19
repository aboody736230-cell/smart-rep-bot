import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

function validSession(value) {
  const [expires, signature] = String(value || '').split('.');
  if (!expires || !signature || Number(expires) < Date.now() || !process.env.ADMIN_SESSION_SECRET) return false;
  const expected = crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(expires).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function GET(request) {
  return NextResponse.json({ authenticated: validSession(request.cookies.get('kadel_admin_session')?.value) });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('kadel_admin_session', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
  return response;
}

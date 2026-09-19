import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { supabaseRequest } from '../../../../lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function validSession(value) {
  const [expires, signature] = String(value || '').split('.');
  if (!expires || !signature || Number(expires) < Date.now() || !process.env.ADMIN_SESSION_SECRET) return false;
  const expected = crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(expires).digest('hex');
  return signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function unauthorized(request) {
  return !validSession(request.cookies.get('kadel_admin_session')?.value);
}

function toClient(row) {
  return { id: row.id, title: row.name, price: row.price ? String(row.price) : '', image: row.image_url || '', description: row.description || '', url: row.affiliate_url || '', store: row.store || '', category: row.category || '', branch: row.branch || '', status: row.status === 'published' ? 'منشور' : 'مسودة' };
}

export async function GET(request) {
  if (unauthorized(request)) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  const response = await supabaseRequest('?select=id,name,price,image_url,description,affiliate_url,store,category,branch,status&order=created_at.desc&limit=100');
  if (!response.ok) return NextResponse.json({ error: 'تعذر قراءة المنتجات من Supabase.' }, { status: 502 });
  const rows = await response.json();
  return NextResponse.json({ products: rows.map(toClient) });
}

export async function POST(request) {
  if (unauthorized(request)) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (!body.title || !body.price || !body.image || !body.url || !body.store || !body.category) return NextResponse.json({ error: 'بيانات المنتج ناقصة.' }, { status: 400 });
  const response = await supabaseRequest('', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ name: body.title, price: Number.parseFloat(String(body.price).replace(/[^0-9.]/g, '')) || 0, image_url: body.image, description: body.description || '', affiliate_url: body.url, store: body.store, category: body.category, branch: body.branch || 'بدون فرع', status: 'draft' }) });
  if (!response.ok) return NextResponse.json({ error: 'تعذر حفظ المنتج في Supabase.' }, { status: 502 });
  const rows = await response.json();
  return NextResponse.json({ product: toClient(rows[0]) }, { status: 201 });
}

export async function PATCH(request) {
  if (unauthorized(request)) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ error: 'معرّف المنتج مطلوب.' }, { status: 400 });
  const patch = {};
  if (body.title !== undefined) patch.name = body.title;
  if (body.price !== undefined) patch.price = Number.parseFloat(String(body.price).replace(/[^0-9.]/g, '')) || 0;
  if (body.status !== undefined) patch.status = body.status === 'منشور' || body.status === 'published' ? 'published' : 'draft';
  patch.updated_at = new Date().toISOString();
  const response = await supabaseRequest(`?id=eq.${encodeURIComponent(body.id)}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(patch) });
  if (!response.ok) return NextResponse.json({ error: 'تعذر تحديث المنتج في Supabase.' }, { status: 502 });
  const rows = await response.json();
  return NextResponse.json({ product: rows[0] ? toClient(rows[0]) : null });
}

export async function DELETE(request) {
  if (unauthorized(request)) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ error: 'معرّف المنتج مطلوب.' }, { status: 400 });
  const response = await supabaseRequest(`?id=eq.${encodeURIComponent(body.id)}`, { method: 'DELETE' });
  if (!response.ok) return NextResponse.json({ error: 'تعذر حذف المنتج من Supabase.' }, { status: 502 });
  return NextResponse.json({ ok: true });
}

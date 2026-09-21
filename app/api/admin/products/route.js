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

function amazonAsin(value) {
  return String(value || '').match(/(?:\/dp\/|\/gp\/product\/|\/gp\/aw\/d\/|[?&]asin=|\/)([A-Z0-9]{10})(?:[/?&#]|$)/i)?.[1]?.toUpperCase() || '';
}

const trackingParams = /^(utm_.+|tag|ref|ref_|linkcode|link_code|camp|creative|creativeasin|ascsubtag|asc_source|sp_csd|dib|dib_tag|pd_rd_.+|qid|sr|crid|keywords?)$/i;

function normalizedUrl(value) {
  try {
    const parsed = new URL(String(value || '').trim());
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const amazonId = amazonAsin(parsed.toString());
    if (amazonId && hostname.includes('amazon')) return `amazon:${amazonId}`;
    parsed.protocol = 'https:';
    parsed.hostname = hostname;
    parsed.hash = '';
    parsed.username = '';
    parsed.password = '';
    parsed.pathname = parsed.pathname.replace(/\/+$/, '') || '/';
    [...parsed.searchParams.keys()].forEach((key) => { if (trackingParams.test(key)) parsed.searchParams.delete(key); });
    parsed.search = [...parsed.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return String(value || '').trim().toLowerCase().replace(/\/+$/, '');
  }
}

async function resolvedUrl(value) {
  try {
    const response = await fetch(String(value), { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KadelDuplicateCheck/1.0)', Accept: 'text/html,*/*' }, redirect: 'follow', signal: AbortSignal.timeout(6000) });
    return response.url || String(value);
  } catch {
    return String(value);
  }
}

function toClient(row) {
  return { id: row.id, title: row.name, price: row.price_text || (row.price ? String(row.price) : ''), image: row.image_url || '', description: row.description || '', url: row.affiliate_url || '', store: row.store || '', category: row.category || '', branch: row.branch || '', status: row.status === 'published' ? 'منشور' : 'مسودة' };
}

export async function GET(request) {
  if (unauthorized(request)) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  const response = await supabaseRequest('?select=id,name,price,price_text,image_url,description,affiliate_url,store,category,branch,status&order=created_at.desc&limit=5000');
  if (!response.ok) return NextResponse.json({ error: 'تعذر قراءة المنتجات من Supabase.' }, { status: 502 });
  const rows = await response.json();
  return NextResponse.json({ products: rows.map(toClient) });
}

export async function POST(request) {
  if (unauthorized(request)) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (!body.title || !body.price || !body.image || !body.url || !body.store || !body.category) return NextResponse.json({ error: 'بيانات المنتج ناقصة.' }, { status: 400 });

  const affiliateUrl = String(body.url).trim();
  const canonicalUrl = normalizedUrl(await resolvedUrl(affiliateUrl));
  const incomingKeys = new Set([normalizedUrl(affiliateUrl), canonicalUrl]);
  const existingResponse = await supabaseRequest(`?select=id,name,affiliate_url,canonical_url&or=(canonical_url.eq.${encodeURIComponent(canonicalUrl)},affiliate_url.eq.${encodeURIComponent(affiliateUrl)})&limit=10`);
  if (!existingResponse.ok) return NextResponse.json({ error: 'تعذر التحقق من وجود الرابط السابق.' }, { status: 502 });
  const existingRows = await existingResponse.json();
  const duplicate = Array.isArray(existingRows) && existingRows.find((row) => {
    const existingKeys = [row.canonical_url, normalizedUrl(row.affiliate_url)].filter(Boolean);
    return existingKeys.some((existingKey) => incomingKeys.has(existingKey));
  });
  if (duplicate) return NextResponse.json({ error: `هذا الرابط والمنتج موجودان من قبل داخل المتجر: ${duplicate.name || ''}` }, { status: 409 });

  const response = await supabaseRequest('', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ name: body.title, price: Number.parseFloat(String(body.price).replace(/[^0-9.]/g, '')) || 0, price_text: String(body.price).trim(), image_url: body.image, description: body.description || '', affiliate_url: affiliateUrl, canonical_url: canonicalUrl, store: body.store, category: body.category, branch: body.branch || 'بدون فرع', status: 'published' }) });
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
  if (body.price !== undefined) { patch.price = Number.parseFloat(String(body.price).replace(/[^0-9.]/g, '')) || 0; patch.price_text = String(body.price).trim(); }
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

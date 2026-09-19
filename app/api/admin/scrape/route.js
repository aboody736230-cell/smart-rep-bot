import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const runtime = 'nodejs';

const domains = {
  SHEIN: ['shein.com', 'us.shein.com', 'ar.shein.com'],
  Amazon: ['amazon.com', 'amazon.sa', 'amazon.ae', 'amazon.co.uk'],
  Temu: ['temu.com'],
  AliExpress: ['aliexpress.com'],
  'نون': ['noon.com'],
  'نمشي': ['namshi.com'],
  'ترينديول': ['trendyol.com'],
};

function isAllowedHost(hostname, allowed) {
  return allowed.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

function firstValue(value) {
  if (Array.isArray(value)) return firstValue(value[0]);
  if (value && typeof value === 'object') return value.url || value.contentUrl || value.value || '';
  return typeof value === 'string' ? value.trim() : value ?? '';
}

function collectJsonLd($) {
  const values = [];
  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const parsed = JSON.parse($(element).text());
      const items = Array.isArray(parsed) ? parsed : parsed['@graph'] || [parsed];
      values.push(...items);
    } catch {}
  });
  return values.find((item) => item && (item['@type'] === 'Product' || (Array.isArray(item['@type']) && item['@type'].includes('Product')))) || {};
}

function meta($, property) {
  return $(`meta[property="${property}"], meta[name="${property}"]`).first().attr('content')?.trim() || '';
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { url, store, category, branch } = body;
  if (!url || !store || !category) return NextResponse.json({ error: 'الرابط والمتجر والقسم مطلوبة.' }, { status: 400 });

  let target;
  try { target = new URL(url); } catch { return NextResponse.json({ error: 'رابط المنتج غير صالح.' }, { status: 400 }); }
  if (!['http:', 'https:'].includes(target.protocol)) return NextResponse.json({ error: 'يسمح بروابط HTTPS وHTTP فقط.' }, { status: 400 });
  if (!domains[store]?.some((domain) => isAllowedHost(target.hostname, [domain]))) return NextResponse.json({ error: `الرابط لا يبدو تابعًا لمتجر ${store}.` }, { status: 400 });

  try {
    const response = await fetch(target, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KadelProductImporter/1.0)', Accept: 'text/html,application/xhtml+xml' }, redirect: 'follow', signal: AbortSignal.timeout(15000), cache: 'no-store' });
    if (!response.ok) return NextResponse.json({ error: `المتجر أعاد الحالة ${response.status}. قد يمنع السحب أو يحتاج موصلًا رسميًا.` }, { status: 502 });
    const html = await response.text();
    const $ = cheerio.load(html);
    const product = collectJsonLd($);
    const offers = product.offers || {};
    const image = firstValue(product.image) || meta($, 'og:image') || meta($, 'twitter:image');
    const title = firstValue(product.name) || meta($, 'og:title') || $('title').first().text().trim();
    const description = firstValue(product.description) || meta($, 'og:description') || $('meta[name="description"]').attr('content')?.trim() || '';
    const price = firstValue(offers.price) || firstValue(offers.lowPrice) || meta($, 'product:price:amount') || '';
    const currency = firstValue(offers.priceCurrency) || meta($, 'product:price:currency') || 'SAR';
    if (!title && !image && !price) return NextResponse.json({ error: 'لم نستطع استخراج بيانات المنتج. هذا المتجر قد يحتاج موصلًا رسميًا أو صفحة المنتج محمّلة بجافاسكربت.' }, { status: 422 });

    return NextResponse.json({ product: { title: title || 'منتج بدون اسم', description, price: price ? `${price} ${currency}` : 'غير متوفر', image, url: target.toString(), store, category, branch: branch || 'بدون فرع', status: 'مسودة' } });
  } catch (error) {
    return NextResponse.json({ error: error?.name === 'TimeoutError' ? 'انتهى وقت الاتصال بالمتجر.' : 'تعذر الوصول إلى صفحة المنتج. قد يكون المتجر حاجبًا للطلبات المباشرة.' }, { status: 502 });
  }
}

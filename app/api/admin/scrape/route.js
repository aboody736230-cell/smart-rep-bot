import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const runtime = 'nodejs';

const domains = {
  SHEIN: ['shein.com', 'us.shein.com', 'ar.shein.com'],
  Amazon: ['amazon.com', 'amazon.sa', 'amazon.ae', 'amazon.co.uk', 'amazon.ca', 'amazon.de', 'amazon.fr', 'amazon.it', 'amazon.es', 'amazon.in', 'amazon.com.tr'],
  Temu: ['temu.com'],
  AliExpress: ['aliexpress.com', 'aliexpress.ru'],
  'نون': ['noon.com'],
  'نمشي': ['namshi.com'],
  'ترينديول': ['trendyol.com'],
};

const affiliateDomains = {
  SHEIN: ['shein.top'],
  Amazon: ['amzn.to', 'amzn.eu', 'a.co', 'link.amazon'],
  Temu: ['share.temu.com'],
  AliExpress: ['s.click.aliexpress.com', 'a.aliexpress.com'],
  'نون': [],
  'نمشي': [],
  'ترينديول': ['ty.gl'],
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

function priceFromDocument($, html) {
  const metaPrice = meta($, 'product:price:amount') || meta($, 'og:price:amount') || $('[itemprop="price"]').first().attr('content') || $('[data-price]').first().attr('data-price') || '';
  if (metaPrice && /\d/.test(metaPrice)) return metaPrice.replace(',', '.');
  const amazonWhole = $('.a-price-whole').first().text().replace(/[^0-9]/g, '');
  const amazonFraction = $('.a-price-fraction').first().text().replace(/[^0-9]/g, '');
  if (amazonWhole) return `${amazonWhole}.${(amazonFraction || '00').padStart(2, '0').slice(0, 2)}`;
  const patterns = [
    /(?:salePrice|finalPrice|currentPrice|discountPrice|retailPrice|sale_price|priceAmount|priceToPay|buyingPrice|displayPrice)["']?\s*[:=]\s*(?:\{[^}]{0,120})?["']?\s*(?:SAR|USD|AED|GBP|EUR|ريال|ر\.س|\$|£|€)?\s*(\d+(?:[.,]\d+)?)/gi,
    /["'](?:price|amount)["']\s*:\s*["']?\s*(?:SAR|USD|AED|GBP|EUR|ريال|ر\.س|\$|£|€)\s*(\d+(?:[.,]\d+)?)/gi,
    /(?:SAR|USD|AED|GBP|EUR|ريال|ر\.س|\$|£|€)\s*(\d+(?:[.,]\d+)?)/gi,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(html);
    if (match?.[1]) return match[1].replace(',', '.');
  }
  return '';
}

function currencyFromHost(hostname) {
  if (hostname.endsWith('amazon.sa')) return 'SAR';
  if (hostname.endsWith('amazon.ae')) return 'AED';
  if (hostname.endsWith('amazon.co.uk')) return 'GBP';
  if (hostname.endsWith('amazon.de') || hostname.endsWith('amazon.fr') || hostname.endsWith('amazon.it') || hostname.endsWith('amazon.es')) return 'EUR';
  if (hostname.endsWith('amazon.ca')) return 'CAD';
  if (hostname.endsWith('amazon.in')) return 'INR';
  if (hostname.endsWith('amazon.com.tr')) return 'TRY';
  return 'USD';
}

function currencyFromDocument($, html, fallback) {
  return meta($, 'product:price:currency') || $('[itemprop="priceCurrency"]').first().attr('content') || (html.match(/(?:currencyCode|currency|priceCurrency)["']?\s*[:=]\s*["']?(SAR|AED|USD|GBP|EUR|CAD|INR|TRY)/i)?.[1] || fallback);
}

function aliExpressProductId(value) {
  return String(value || '').match(/(?:\/item\/|[?&](?:productId|itemId)=)(\d{8,})/i)?.[1] || '';
}

function aliExpressPriceFromUrl(value) {
  const match = String(value || '').match(/pdp_npi=[^#]*?%?40?dis%?21([A-Z]{3})%?21([0-9.,]+)%?21([0-9.,]+)/i);
  if (!match) return { price: '', currency: '' };
  return { price: match[3].replace(',', '.'), currency: match[1].toUpperCase() };
}

async function aliExpressReaderFallback(productId, sourceUrl) {
  if (!productId) return {};
  const readerUrl = `https://r.jina.ai/http://www.aliexpress.com/item/${productId}.html`;
  const response = await fetch(readerUrl, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/plain' }, signal: AbortSignal.timeout(12000), cache: 'no-store' });
  if (!response.ok) return {};
  const markdown = await response.text();
  const title = markdown.match(/^Title:\s*(.+)$/m)?.[1]?.trim() || '';
  const images = [...markdown.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1].replace(/_220x220q75\.jpg_\.avif$/, '_960x960q75.jpg_.avif'));
  const image = images.find((value) => !/48x48|all-categories|search-by-image/i.test(value)) || '';
  const sourcePrice = aliExpressPriceFromUrl(sourceUrl);
  return { title, image, price: sourcePrice.price, currency: sourcePrice.currency };
}

function amazonAsin(value) {
  return String(value || '').match(/(?:\/dp\/|\/gp\/product\/|\/gp\/aw\/d\/|[?&]asin=|\/)([A-Z0-9]{10})(?:[/?&#]|$)/i)?.[1] || '';
}

function amazonProductFields($) {
  const title = $('#productTitle').first().text().trim();
  const landingImage = $('#landingImage').first();
  let dynamicImage = '';
  try {
    const images = JSON.parse(landingImage.attr('data-a-dynamic-image') || '{}');
    dynamicImage = Object.entries(images).sort((a, b) => (Number(b[1]?.[0] || 0) * Number(b[1]?.[1] || 0)) - (Number(a[1]?.[0] || 0) * Number(a[1]?.[1] || 0)))[0]?.[0] || '';
  } catch {}
  const image = landingImage.attr('data-old-hires') || dynamicImage || landingImage.attr('src') || $('#imgBlkFront').attr('src') || $('meta[property="og:image"]').attr('content') || '';
  const priceText = $('#corePriceDisplay_desktop_feature_div .a-offscreen, #corePrice_desktop .a-offscreen, #priceblock_ourprice, #priceblock_dealprice, .a-price .a-offscreen').first().text().trim();
  return { title, image, priceText };
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { url, store, category, branch } = body;
  if (!url || !store || !category) return NextResponse.json({ error: 'الرابط والمتجر والقسم مطلوبة.' }, { status: 400 });

  let target;
  try { target = new URL(url); } catch { return NextResponse.json({ error: 'رابط المنتج غير صالح.' }, { status: 400 }); }
  if (!['http:', 'https:'].includes(target.protocol)) return NextResponse.json({ error: 'يسمح بروابط HTTPS وHTTP فقط.' }, { status: 400 });
  const acceptedInitialDomains = [...(domains[store] || []), ...(affiliateDomains[store] || [])];
  if (!acceptedInitialDomains.some((domain) => isAllowedHost(target.hostname, [domain]))) return NextResponse.json({ error: `الرابط لا يبدو تابعًا لمتجر ${store} أو رابط عمولة معروف له.` }, { status: 400 });

  try {
    const isAmazon = store === 'Amazon';
    const asin = isAmazon ? amazonAsin(target.toString()) : '';
    const directAmazonUrl = asin && !domains.Amazon.some((domain) => isAllowedHost(target.hostname, [domain])) ? new URL(`https://www.amazon.com/gp/aw/d/${asin}`) : target;
    const response = await fetch(directAmazonUrl, { headers: { 'User-Agent': isAmazon ? 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36' : 'Mozilla/5.0 (compatible; KadelProductImporter/1.0)', Accept: 'text/html,application/xhtml+xml' }, redirect: 'follow', signal: AbortSignal.timeout(isAmazon ? 8000 : 20000), cache: 'no-store' });
    if (!response.ok) return NextResponse.json({ error: `المتجر أعاد الحالة ${response.status}. قد يمنع السحب أو يحتاج موصلًا رسميًا.` }, { status: 502 });
    const finalUrl = new URL(response.url || target.toString());
    if (!domains[store]?.some((domain) => isAllowedHost(finalUrl.hostname, [domain]))) return NextResponse.json({ error: 'تم تحويل رابط العمولة إلى نطاق غير متوقع، لذلك أوقفنا السحب للحماية.' }, { status: 400 });
    const html = await response.text();
    let $ = cheerio.load(html);
    let product = collectJsonLd($);
    let offers = product.offers || {};
    let image = firstValue(product.image) || meta($, 'og:image') || meta($, 'twitter:image');
    let title = firstValue(product.name) || meta($, 'og:title') || $('title').first().text().trim();
    let description = firstValue(product.description) || meta($, 'og:description') || $('meta[name="description"]').attr('content')?.trim() || '';
    let price = firstValue(offers.price) || firstValue(offers.lowPrice) || priceFromDocument($, html);
    let currency = firstValue(offers.priceCurrency) || currencyFromDocument($, html, store === 'Amazon' ? currencyFromHost(finalUrl.hostname) : '');

    if (store === 'Amazon') {
      const amazonFields = amazonProductFields($);
      title = amazonFields.title || title;
      image = amazonFields.image || image;
      if (!price && amazonFields.priceText) price = amazonFields.priceText.match(/[0-9]+(?:[.,][0-9]{1,2})?/)?.[0]?.replace(',', '.') || '';
      if (!currency) currency = currencyFromHost(finalUrl.hostname);
    }

    if (store === 'Amazon' && (!title || !image || !price)) {
      const asin = amazonAsin(finalUrl.toString()) || amazonAsin(target.toString()) || amazonAsin(html);
      if (asin) {
        try {
          const mobileUrl = `${finalUrl.origin}/gp/aw/d/${asin}`;
          const mobileResponse = await fetch(mobileUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36', Accept: 'text/html,application/xhtml+xml', 'Accept-Language': 'en-US,en;q=0.9' }, redirect: 'follow', signal: AbortSignal.timeout(8000), cache: 'no-store' });
          if (mobileResponse.ok) {
            const mobileHtml = await mobileResponse.text();
            $ = cheerio.load(mobileHtml);
            const mobileProduct = collectJsonLd($);
            const mobileOffers = mobileProduct.offers || {};
            const mobileFields = amazonProductFields($);
            title = title || mobileFields.title || firstValue(mobileProduct.name) || meta($, 'og:title');
            image = image || mobileFields.image || firstValue(mobileProduct.image) || meta($, 'og:image');
            price = price || firstValue(mobileOffers.price) || firstValue(mobileOffers.lowPrice) || priceFromDocument($, mobileHtml) || mobileFields.priceText.match(/[0-9]+(?:[.,][0-9]{1,2})?/)?.[0]?.replace(',', '.') || '';
            currency = firstValue(mobileOffers.priceCurrency) || currencyFromDocument($, mobileHtml, currency || currencyFromHost(finalUrl.hostname));
          }
        } catch {}
      }
    }

    if (store === 'Amazon' && !image) {
      const asin = amazonAsin(finalUrl.toString()) || amazonAsin(target.toString());
      if (asin) image = `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;
    }

    if (store === 'AliExpress') {
      const productId = aliExpressProductId(finalUrl.toString()) || aliExpressProductId(target.toString()) || aliExpressProductId(html);
      const aliPrice = aliExpressPriceFromUrl(finalUrl.toString());
      const aliChallenge = /captcha|verification|x5secdata|\bpunish\b|\"action\":\"captcha\"/i.test(`${title} ${image} ${html}`);
      if (aliChallenge) { title = ''; image = ''; description = ''; }
      if (productId && (!title || !image || !price || aliChallenge)) {
        try {
          const fallback = await aliExpressReaderFallback(productId, finalUrl.toString());
          title = title || fallback.title;
          image = image || fallback.image;
          price = price || fallback.price || aliPrice.price;
          currency = currency || fallback.currency || aliPrice.currency;
        } catch {}
      }
      if (!price) price = aliPrice.price;
      if (!currency) currency = aliPrice.currency;
      if (!title && productId) title = `منتج AliExpress رقم ${productId}`;
    }

    const linkedProductUrl = $('#url').attr('value') || $('input[name="url"]').attr('value') || '';
    if (!price && linkedProductUrl) {
      try {
        const detailUrl = new URL(linkedProductUrl.replaceAll('&amp;', '&'));
        if (domains[store]?.some((domain) => isAllowedHost(detailUrl.hostname, [domain]))) {
          const detailResponse = await fetch(detailUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KadelProductImporter/1.0)', Accept: 'text/html,application/xhtml+xml' }, redirect: 'follow', signal: AbortSignal.timeout(store === 'Amazon' ? 8000 : 20000), cache: 'no-store' });
          if (detailResponse.ok) {
            const detailHtml = await detailResponse.text();
            $ = cheerio.load(detailHtml);
            product = collectJsonLd($);
            offers = product.offers || {};
            image = firstValue(product.image) || meta($, 'og:image') || meta($, 'twitter:image') || image;
            title = title || firstValue(product.name) || meta($, 'og:title') || $('title').first().text().trim();
            description = firstValue(product.description) || meta($, 'og:description') || description;
            price = firstValue(offers.price) || firstValue(offers.lowPrice) || priceFromDocument($, detailHtml);
            currency = firstValue(offers.priceCurrency) || currencyFromDocument($, detailHtml, currency);
          }
        }
      } catch {}
    }
    if (!title && !image && !price) return NextResponse.json({ error: 'لم نستطع استخراج بيانات المنتج. قد يكون أمازون حاجبًا للطلبات المباشرة أو يحتاج صفحة محمّلة بجافاسكربت.' }, { status: 422 });

    return NextResponse.json({ product: { title: title || 'منتج بدون اسم', description, price: price ? `${price}${currency ? ` ${currency}` : ''}` : 'غير متوفر', image, url: target.toString(), store, category, branch: branch || 'بدون فرع', status: 'مسودة' } });
  } catch (error) {
    return NextResponse.json({ error: error?.name === 'TimeoutError' ? `انتهى وقت الاتصال ب${store}.` : 'تعذر الوصول إلى صفحة المنتج. قد يكون المتجر حاجبًا للطلبات المباشرة.' }, { status: 502 });
  }
}

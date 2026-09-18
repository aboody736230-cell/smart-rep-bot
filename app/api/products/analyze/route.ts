import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ 
        success: false, 
        message: 'يرجى إرسال رابط صحيح لتحليله.' 
      }, { status: 400 });
    }

    const response = await axios.get(url.trim(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      },
      timeout: 12000
    });

    const $ = cheerio.load(response.data);

    const title = 
      $('meta[property="og:title"]').attr('content') ||
      $('title').text() ||
      $('h1').first().text() ||
      'منتج مميز من KADEL';

    let image = 
      $('meta[property="og:image"]').attr('content') ||
      $('#landingImage').attr('src') ||
      $('.crop-image-container img').attr('src') ||
      $('img').first().attr('src') ||
      null;

    if (image) {
      if (image.startsWith('//')) image = 'https:' + image;
      image = image.replace(/_[0-9]+x[0-9]+/g, '');
    }

    let priceStr = 
      $('meta[property="product:price:amount"]').attr('content') ||
      $('.a-price .a-offscreen').first().text() ||
      $('.price').first().text() ||
      '';

    let cleanPrice = priceStr.trim();
    if (cleanPrice && !cleanPrice.includes('$')) {
      cleanPrice = '$' + cleanPrice.replace(/[^0-9.]/g, '');
    }

    let storeName = 'متجر عالمي';
    try {
      const parsedUrl = new URL(url);
      storeName = parsedUrl.hostname.replace('www.', '');
    } catch (e) {}

    const description = $('meta[property="og:description"]').attr('content') || 'تشكيلة فاخرة مختارة بعناية لأناقتك.';

    return NextResponse.json({
      success: true,
      product: {
        title: title.trim(),
        price: cleanPrice || 'السعر عند الطلب',
        currency: '$',
        description: description.trim(),
        image: image,
        brand: storeName.toUpperCase(),
        sku: null,
        availability: 'InStock',
        rating: '4.9',
        reviewCount: '120',
        sourceUrl: url,
        storeName: storeName,
        rawPrice: null
      }
    });

  } catch (error: any) {
    console.error("Scraping API Error:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: 'تعذر سحب بيانات المنتج تلقائياً بسبب حماية المتجر، يرجى إدخاله يدوياً.' 
    }, { status: 500 });
  }
}

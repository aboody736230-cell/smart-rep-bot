'use client';
import { useState } from 'react';
import { Search, Camera } from 'lucide-react';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('shoes');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'shoes', name: 'الأحذية', icon: '👠' },
    { id: 'clothes', name: 'الملابس', icon: '👗' },
    { id: 'bags', name: 'الشنط', icon: '👜' },
    { id: 'beauty', name: 'الجمال', icon: '💄' },
  ];

  const categoryDetails = {
    shoes: {
      title: 'قسم الأحذية الفاخرة 👠 👞',
      desc: 'اختترنا لك أرقى تصاميم الأحذية العصرية والرياضية لتمنحك راحة فائقة وحضوراً مميزاً.',
      product: {
        store: 'AMAZON',
        title: 'SKECHERS GO WALK ...LIDE-STEP 2.0 WOMEN',
        price: '253.08 رس',
        rating: '9 / 5',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=60',
      }
    },
    clothes: {
      title: 'قسم الملابس الراقية 👗',
      desc: 'تشكيلة واسعة من أحدث صيحات الموضة والملابس العصرية لتناسب كل مناسباتك.',
      product: {
        store: 'AMAZON',
        title: 'تشكيلة فساتين وملابس عصرية راقية تلبي ذوقك الرفيع',
        price: '320.00 رس',
        rating: '10 / 5',
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&auto=format&fit=crop&q=60',
      }
    },
    bags: {
      title: 'قسم الشنط الفاخرة 👜',
      desc: 'شنط أنيقة وعملية بتصميمات عالمية تناسب إطلالتك اليومية والرسمية.',
      product: {
        store: 'AMAZON',
        title: 'حقيبة يد نسائية جلدية فاخرة بتصميم عصري جذاب',
        price: '215.50 رس',
        rating: '8 / 4',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=60',
      }
    },
    beauty: {
      title: 'قسم الجمال والعناية 💄',
      desc: 'منتجات العناية والتجميل الأصلية لتبرز جمالك وتمنحك إشراقة دائمة.',
      product: {
        store: 'AMAZON',
        title: 'مجموعة العناية والتجميل المتكاملة للبشرة العصرية',
        price: '145.00 رس',
        rating: '7 / 5',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=60',
      }
    }
  };

  const current = categoryDetails[activeCategory];

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-gray-900 p-4 font-sans" dir="rtl">
      {/* Header */}
      <header className="flex items-center justify-between mb-5 bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1 max-w-lg mx-2">
          <input
            type="text"
            placeholder="ابحث بالاسم أو ارفع صورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100/80 border border-gray-200/60 rounded-full py-2 pr-10 pl-10 text-xs sm:text-sm outline-none focus:bg-white focus:border-gray-300 transition"
          />
          <Search className="absolute right-3.5 top-2.5 text-gray-400 w-4 h-4" />
          <Camera className="absolute left-3.5 top-2.5 text-gray-500 w-4 h-4 cursor-pointer hover:text-black" />
        </div>
        <h1 className="text-xl font-black tracking-wider text-black">KADEL</h1>
      </header>

      {/* Categories Horizontal Pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition shadow-sm border ${
              activeCategory === cat.id
                ? 'bg-white text-black border-gray-300 ring-1 ring-gray-300'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{cat.name}</span>
            <span>{cat.icon}</span>
          </button>
        ))}
      </div>

      {/* Main Active Category Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200/70">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 flex items-center gap-2">
          {current.title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-5 leading-relaxed">
          {current.desc}
        </p>

        {/* Product Card Inside */}
        <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="inline-block bg-white border border-gray-200 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs mb-2">
              {current.product.store}
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 mb-2 leading-snug">
              {current.product.title}
            </h3>
            <p className="text-xs sm:text-sm font-black text-gray-900 mb-3">{current.product.price}</p>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-gray-400 font-medium">{current.product.rating}</span>
              <button className="flex items-center gap-1 bg-[#fff8e6] hover:bg-[#ffefcc] text-[#856404] border border-[#ffeeba] px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs">
                <span>🔍 عرض القسم</span>
              </button>
            </div>
          </div>
          
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-2 shadow-xs">
            <img src={current.product.image} alt={current.product.title} className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </main>
  );
}

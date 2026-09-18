'use client';
import { useState } from 'react';
import { Search, Camera, ChevronDown, ChevronUp } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategory, setOpenCategory] = useState('shoes');

  const categories = [
    { id: 'shoes', name: 'الأحذية', icon: '👠' },
    { id: 'clothes', name: 'الملابس', icon: '👗' },
    { id: 'bags', name: 'الشنط', icon: '👜' },
    { id: 'beauty', name: 'الجمال', icon: '💄' },
  ];

  const productsData = {
    shoes: [
      {
        title: 'SKECHERS GO WALK LIDE-STEP 2.0 WOMEN',
        price: '253.08 رس',
        store: 'AMAZON',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=60',
      },
      {
        title: 'حذاء رياضي أنيق ومريح للمشي اليومي',
        price: '190.00 رس',
        store: 'AMAZON',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&auto=format&fit=crop&q=60',
      }
    ],
    clothes: [
      {
        title: 'تشكيلة فساتين عصرية راقية تلبي ذوقك الرفيع',
        price: '320.00 رس',
        store: 'AMAZON',
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&auto=format&fit=crop&q=60',
      }
    ],
    bags: [
      {
        title: 'حقيبة يد نسائية جلدية فاخرة بتصميم عصري',
        price: '215.50 رس',
        store: 'AMAZON',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=60',
      }
    ],
    beauty: [
      {
        title: 'مجموعة العناية والتجميل المتكاملة للبشرة',
        price: '145.00 رس',
        store: 'AMAZON',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=60',
      }
    ]
  };

  const toggleCategory = (catId) => {
    setOpenCategory(openCategory === catId ? null : catId);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-4 font-sans" dir="rtl">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1 max-w-xl mx-2">
          <input
            type="text"
            placeholder="ابحث بالاسم أو ارفع صورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 border border-transparent focus:border-gray-300 rounded-full py-2.5 pr-10 pl-4 text-sm outline-none transition"
          />
          <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
          <Camera className="absolute left-3 top-3 text-gray-500 w-5 h-5 cursor-pointer hover:text-black" />
        </div>
        <h1 className="text-xl font-black tracking-wider text-black">KADEL</h1>
      </header>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition shadow-sm ${
              openCategory === cat.id
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-100'
            }`}
          >
            <span>{cat.name}</span>
            <span>{cat.icon}</span>
          </button>
        ))}
      </div>

      {/* Categories Sections */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const isOpen = openCategory === cat.id;
          return (
            <div key={cat.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 transition-all">
              {/* Category Header */}
              <div
                onClick={() => toggleCategory(cat.id)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <h2 className="text-lg font-bold text-gray-900">قسم {cat.name} الفاخرة</h2>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </div>

              <p className="text-xs text-gray-500 mt-1 mb-4">
                اختَرنا لك أرقى تصاميم {cat.name} العصرية لتمنحك راحة فائقة وحضوراً مميزاً.
              </p>

              {/* Products / Branches */}
              {isOpen && (
                <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
                  {productsData[cat.id]?.map((product, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <span className="inline-block bg-white border border-gray-200 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-md mb-2">
                          {product.store}
                        </span>
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                          {product.title}
                        </h3>
                        <p className="text-sm font-bold text-gray-900 mb-3">{product.price}</p>
                        
                        <button className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-medium transition">
                          <span>🔍 عرض القسم</span>
                        </button>
                      </div>
                      
                      <div className="w-24 h-24 bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                        <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

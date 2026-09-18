'use client';
import { useState, useRef } from 'react';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [pinkBannerId, setPinkBannerId] = useState(null);
  const [skyBlueCatId, setSkyBlueCatId] = useState(null);
  const [favorites, setFavorites] = useState({});

  // مراجع للتمرير السلس والأضواء
  const catRefs = useRef({});
  const topSectionRef = useRef(null);

  const categories = [
    {
      id: 'shoes',
      name: 'قسم الأحذية',
      desc: 'خطوات تنبض بالفخامة والأناقة لكل المناسبات',
      sub: ['أحذية رياضية', 'أحذية مشي', 'أحذية كعب', 'أحذية كاجوال'],
      items: [
        { id: 's1', name: 'حذاء رياضي برو فليكس', image: '👟' },
        { id: 's2', name: 'حذاء مشي مريح للغاية', image: '👞' },
      ]
    },
    {
      id: 'clothes',
      name: 'قسم الملابس',
      desc: 'تشكيلة عصرية راقية تلبي ذوقك الرفيع',
      sub: ['بلوزات', 'فساتين', 'سراويل', 'جينزات', 'ملابس داخلية'],
      items: [
        { id: 'c1', name: 'بلوزة سهرة أنيقة', image: '👚' },
        { id: 'c2', name: 'جينز عصري مريح', image: '👖' },
      ]
    },
    {
      id: 'bags',
      name: 'قسم الشنط',
      desc: 'عنوان الأناقة والجاذبية في كل إطلالة',
      sub: ['شنط كتف', 'شنط سهرات', 'شنط يد'],
      items: [
        { id: 'b1', name: 'شنطة يد جلد فاخرة', image: '👜' },
        { id: 'b2', name: 'شنطة سهرة براقة', image: '👛' },
      ]
    },
    {
      id: 'beauty',
      name: 'قسم العناية والجمال',
      desc: 'سر تألقك وإشراقتك الطبيعية اليومية',
      sub: ['كريمات وزيوت شعر', 'العناية بالبشرة', 'التجميل', 'إكسسوارات'],
      items: [
        { id: 'u1', name: 'مجموعة عناية بالبشرة', image: '🧴' },
        { id: 'u2', name: 'زيت شعر عضوي مغذي', image: '🌿' },
      ]
    },
    {
      id: 'perfumes',
      name: 'قسم العطور',
      desc: 'عطور ساحرة تدوم طويلاً وتترك أثراً لا يُنسى',
      sub: ['عطور شرقية', 'عطور فرنسية', 'عطور خاصة'],
      items: [
        { id: 'p1', name: 'عطر الملكي الفاخر', image: '🏺' },
        { id: 'p2', name: 'عطر الزهور البرية', image: '🌸' },
      ]
    },
  ];

  // دالة النقر على بنر القسم في الأسفل
  const handleBannerClick = (catId) => {
    setPinkBannerId(catId);
    setSkyBlueCatId(catId);

    // الصعود للأعلى بسلاسة إلى القسم الرئيسي
    if (catRefs.current[catId]) {
      catRefs.current[catId].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // إزالة تأثير اللون الوردي والسماوي بعد ثانيتين
    setTimeout(() => {
      setPinkBannerId(null);
      setSkyBlueCatId(null);
    }, 3000);
  };

  // تبديل المفضلة
  const toggleFavorite = (itemId) => {
    setFavorites(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // مشاركة واتساب
  const shareWhatsApp = (itemName) => {
    const text = encodeURIComponent(`أهلاً أبو كنان، أعجبني هذا المنتج في متجر Kadel: ${itemName}`);
    window.open(`https://api.whatsapp.com/send?phone=&text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans font-extrabold" dir="rtl">
      
      {/* 1. الهيدر الجذاب وشريط البحث المتقدم */}
      <header className="border-b border-slate-800 py-4 px-6 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* اسم المتجر */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">✨</span>
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent tracking-wide">
              متجر Kadel
            </h1>
          </div>

          {/* شريط البحث المزوّد بالبحث بالصورة */}
          <div className="flex items-center w-full md:w-auto flex-1 max-w-xl bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 shadow-inner">
            <span className="text-slate-400 ml-2">🔍</span>
            <input 
              type="text" 
              placeholder="ابحث عن منتجك المفضل..." 
              className="bg-transparent border-none outline-none text-white w-full text-sm font-bold placeholder-slate-500"
            />
            {/* زر البحث بالصورة */}
            <label className="cursor-pointer hover:opacity-80 transition-opacity p-1 bg-slate-800 rounded-xl flex items-center gap-1 px-2 text-xs text-blue-400" title="البحث بالصورة">
              <span>📷 بحث بالصورة</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          {/* أزرار الإدارة والمراسلة */}
          <div className="flex items-center gap-3">
            <a 
              href="https://api.whatsapp.com/send?phone=&text=أهلاً%20أبو%20كنان،%20أريد%20الاستفسار%20عن%20متجر%20Kadel" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl text-sm font-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              💬 مراسلة المتجر
            </a>
            <a 
              href="/admin" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-2xl text-sm font-black transition-all shadow-lg shadow-blue-600/30"
            >
              ⚙️ الآدمن
            </a>
          </div>

        </div>
      </header>

      {/* 2. البنر الترحيبي المتحرك (جمعنا عدة متاجر في متجر واحد) */}
      <section className="py-12 px-6 text-center bg-gradient-to-b from-blue-950/60 via-slate-900 to-slate-950 border-b border-slate-900">
        <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase">
            🚀 الوجهة الأولى للتسوق الرقمي
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            « جمعنا عدة متاجر في متجر واحد »
          </h2>
          <p className="text-slate-300 text-base md:text-lg font-bold max-w-2xl mx-auto">
            أهلاً بك يا أبو كنان في عالم الأناقة والتميز! استعرض أرقى المنتجات العالمية المصممة خصيصاً لتلبي كافة تطلعاتك بكل فخامة وسهولة.
          </p>
        </div>
      </section>

      {/* 3. الأقسام الرئيسية الخمسة (تفتح فروعها عرضياً عند الضغط) */}
      <section className="max-w-7xl mx-auto px-6 py-10" ref={topSectionRef}>
        <h3 className="text-xl font-black mb-6 text-slate-200 border-r-4 border-blue-500 pr-3">
          الأقسام الرئيسية المتكاملة
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const isSkyBlue = skyBlueCatId === cat.id;
            return (
              <div 
                key={cat.id}
                ref={el => catRefs.current[cat.id] = el}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`cursor-pointer bg-slate-900/90 border-2 rounded-2xl p-5 transition-all duration-300 shadow-xl flex flex-col justify-between group hover:border-blue-500 ${
                  isSkyBlue ? 'border-sky-400 bg-sky-950/40 shadow-sky-500/50 scale-105' : 'border-slate-800'
                }`}
              >
                <div>
                  <h4 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-bold mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-blue-400 font-black">
                  <span>{activeCategory === cat.id ? 'إخفاء الفروع ▲' : 'استعراض الفروع ▼'}</span>
                </div>

                {/* الفروع تفتح بشكل عرضي وأنيق أسفل القسم عند النقر */}
                {activeCategory === cat.id && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-2 animate-fadeIn">
                    {cat.sub.map((subItem, idx) => (
                      <span 
                        key={idx} 
                        className="bg-slate-950 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-xl text-xs font-black shadow-md hover:bg-emerald-950/50 transition-colors"
                      >
                        {subItem}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. تفاصيل باقي الصفحة الرئيسية للأقسام (اسم + وصف + بنر عريض متقلب بدون أسعار) */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-16">
        {categories.map((cat) => {
          const isPink = pinkBannerId === cat.id;
          return (
            <div key={cat.id} className="space-y-6 bg-slate-900/40 border border-slate-900/80 p-6 rounded-3xl">
              
              {/* عنوان القسم الرئيسي مع وصف جميل */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2">
                    <span>🔥</span> {cat.name}
                  </h3>
                  <p className="text-slate-400 text-sm font-bold mt-1">
                    {cat.desc}
                  </p>
                </div>
                <span className="text-xs text-blue-400 font-black bg-blue-950/60 border border-blue-900 px-3 py-1 rounded-full">
                  تشكيلة مميزة وخاصة
                </span>
              </div>

              {/* بنر عريض متقلب يعرض منتجات القسم (بدون أسعار) - عند النقر يضيء بالوردي ويصعد للأعلى */}
              <div 
                onClick={() => handleBannerClick(cat.id)}
                className={`cursor-pointer rounded-3xl p-6 border-2 transition-all duration-500 shadow-2xl relative overflow-hidden group ${
                  isPink 
                    ? 'border-pink-500 bg-gradient-to-r from-pink-950/80 via-purple-950/80 to-slate-950 shadow-pink-500/60 scale-[1.02]' 
                    : 'border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 hover:border-pink-500/50'
                }`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="text-center mb-6">
                  <span className="text-xs text-pink-400 tracking-widest uppercase bg-pink-950/50 border border-pink-500/30 px-4 py-1 rounded-full font-black">
                    بنر عريض تفاعلي — اضغط للانتقال والربط العلوي ⚡
                  </span>
                </div>

                {/* منتجات البنر بدون أسعار */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {cat.items.map((item) => {
                    const isFav = favorites[item.id];
                    return (
                      <div 
                        key={item.id} 
                        onClick={(e) => e.stopPropagation()} // منع انتقال الضغط العام لكي يعمل زر الواتس والمفضلة بحرية
                        className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 hover:border-pink-500/40 transition-all flex flex-col justify-between shadow-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                            {item.image}
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-white">{item.name}</h4>
                            <p className="text-xs text-slate-400 font-bold mt-1">منتج حصري وفاخر بمتجر كادل</p>
                          </div>
                        </div>

                        {/* تحت كل سلعة: مشاركة واتساب وزر مفضلة */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-900">
                          
                          {/* زر مفضلة */}
                          <button 
                            onClick={() => toggleFavorite(item.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                              isFav ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/40' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <span>{isFav ? '❤️ مُفضلة' : '🤍 مفضلة'}</span>
                          </button>

                          {/* زر مشاركة واتساب */}
                          <button 
                            onClick={() => shareWhatsApp(item.name)}
                            className="bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                          >
                            <span>📲 مشاركة واتس</span>
                          </button>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </main>

      {/* الفوتر */}
      <footer className="border-t border-slate-900 py-8 text-center text-slate-500 text-sm font-bold bg-slate-950">
        <p>جميع الحقوق محفوظة © 2026 - متجر Kadel | إشراف: أبو كنان 👑</p>
      </footer>
    </div>
  );
}

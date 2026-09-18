'use client';

import { useState } from 'react';
import { Camera, ChevronDown, Search, Sparkles } from 'lucide-react';

const categories = [
  {
    id: 'shoes',
    name: 'الأحذية',
    icon: '👠',
    subcategories: ['أحذية رياضية', 'أحذية مشي', 'أحذية كعب', 'أحذية كاجوال'],
  },
  {
    id: 'clothes',
    name: 'الملابس',
    icon: '👗',
    subcategories: ['فساتين', 'بلوزات', 'فساتين سهرات', 'جينزات', 'ملابس داخلية', 'سراويل'],
  },
  {
    id: 'bags',
    name: 'الشنط',
    icon: '👜',
    subcategories: ['شنط كتف', 'شنط سهرات', 'شنط يد'],
  },
  {
    id: 'beauty',
    name: 'العناية والجمال',
    icon: '💄',
    subcategories: ['مكياج وتجميل', 'العناية بالشعر', 'العناية بالبشرة'],
  },
  {
    id: 'perfumes',
    name: 'العطور',
    icon: '🌸',
    subcategories: [],
  },
];

const categoryDetails = {
  shoes: {
    title: 'قسم الأحذية الفاخرة 👠 👞',
    desc: 'اخترنا لك أرقى تصاميم الأحذية العصرية والرياضية لتمنحك راحة فائقة وحضوراً مميزاً.',
    product: {
      store: 'AMAZON',
      title: 'SKECHERS GO WALK ...LIDE-STEP 2.0 WOMEN',
      price: '253.08 رس',
      rating: '9 / 5',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=60',
    },
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
    },
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
    },
  },
  beauty: {
    title: 'قسم العناية والجمال 💄',
    desc: 'منتجات العناية والتجميل الأصلية لتبرز جمالك وتمنحك إشراقة دائمة.',
    product: {
      store: 'AMAZON',
      title: 'مجموعة العناية والتجميل المتكاملة للبشرة العصرية',
      price: '145.00 رس',
      rating: '7 / 5',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=60',
    },
  },
  perfumes: {
    title: 'قسم العطور الفاخرة 🌸',
    desc: 'اكتشف أجمل العطور والروائح الراقية التي تضيف لمظهرك لمسة من الفخامة والتميز.',
    product: {
      store: 'AMAZON',
      title: 'عطور فاخرة بروائح ثابتة تناسب ذوقك وإطلالتك',
      price: '189.00 رس',
      rating: '9 / 5',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&auto=format&fit=crop&q=60',
    },
  },
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('shoes');
  const [activeSubcategory, setActiveSubcategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const current = categoryDetails[activeCategory];
  const selectedCategory = categories.find((category) => category.id === activeCategory);

  const handleCategoryClick = (category) => {
    setActiveCategory(category.id);
    setActiveSubcategory('');
  };

  return (
    <main className="store-shell" dir="rtl">
      <div className="store-container">
        <header className="store-header">
          <div className="brand-block">
            <span className="brand-mark">K</span>
            <h1>KADEL</h1>
          </div>

          <div className="search-box">
            <Search aria-hidden="true" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو ارفع صورة..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="البحث عن منتج"
            />
            <button type="button" aria-label="البحث بالصورة" className="camera-button">
              <Camera aria-hidden="true" />
            </button>
          </div>
        </header>

        <nav className="categories" aria-label="أقسام المتجر">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                type="button"
                key={category.id}
                className={`category-pill ${isActive ? 'category-pill-active' : ''}`}
                onClick={() => handleCategoryClick(category)}
                aria-expanded={isActive}
              >
                <span>{category.name}</span>
                <span className="category-icon">{category.icon}</span>
                {category.subcategories.length > 0 && (
                  <ChevronDown className={`category-chevron ${isActive ? 'rotate' : ''}`} aria-hidden="true" />
                )}
              </button>
            );
          })}
        </nav>

        {selectedCategory?.subcategories.length > 0 && (
          <div className="subcategory-panel" aria-label={`فروع ${selectedCategory.name}`}>
            <div className="subcategory-heading">
              <span>فروع {selectedCategory.name}</span>
              <span className="subcategory-count">{selectedCategory.subcategories.length} فروع</span>
            </div>
            <div className="subcategory-list">
              {selectedCategory.subcategories.map((subcategory) => (
                <button
                  type="button"
                  key={subcategory}
                  className={`subcategory-pill ${activeSubcategory === subcategory ? 'subcategory-pill-active' : ''}`}
                  onClick={() => setActiveSubcategory(subcategory)}
                >
                  {subcategory}
                </button>
              ))}
            </div>
          </div>
        )}

        <section className="category-card" aria-labelledby="category-title">
          <div className="section-heading">
            <div className="section-title-row">
              <span className="section-accent"><Sparkles aria-hidden="true" /></span>
              <h2 id="category-title">{current.title}</h2>
            </div>
            {activeSubcategory && <span className="selected-label">{activeSubcategory}</span>}
          </div>
          <p className="section-description">{current.desc}</p>

          <article className="product-card">
            <div className="product-information">
              <span className="store-label">{current.product.store}</span>
              <h3>{current.product.title}</h3>
              <p className="product-price">{current.product.price}</p>
              <div className="product-footer">
                <span className="product-rating">{current.product.rating}</span>
                <button type="button" className="view-category-button">
                  🔍 عرض القسم
                </button>
              </div>
            </div>
            <div className="product-image-wrapper">
              <img src={current.product.image} alt={current.product.title} />
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

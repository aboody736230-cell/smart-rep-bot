'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Camera, ChevronDown, Image as ImageIcon, Search, Sparkles } from 'lucide-react';

const categories = [
  { id: 'shoes', name: 'الأحذية', icon: '👠', subcategories: ['أحذية رياضية', 'أحذية مشي', 'أحذية كعب', 'أحذية كاجوال'] },
  { id: 'clothes', name: 'الملابس', icon: '👗', subcategories: ['فساتين', 'بلوزات', 'فساتين سهرات', 'جينزات', 'ملابس داخلية', 'سراويل'] },
  { id: 'bags', name: 'الشنط', icon: '👜', subcategories: ['شنط كتف', 'شنط سهرات', 'شنط يد'] },
  { id: 'beauty', name: 'العناية والجمال', icon: '💄', subcategories: ['مكياج وتجميل', 'العناية بالشعر', 'العناية بالبشرة'] },
  { id: 'perfumes', name: 'العطور', icon: '🌸', subcategories: [] },
];

const childSubcategories = {
  بناتي: ['فساتين', 'ملابس داخلية', 'أحذية', 'كماليات', 'بناطيل', 'تيشرتات'],
  ولادي: ['أطقم', 'ملابس داخلية', 'أحذية', 'تيشرتات', 'بناطيل'],
};

const storeNames = ['SHEIN', 'Amazon', 'Temu', 'AliExpress', 'نون', 'نمشي', 'ترينديول'];

const heroSlides = [
  { eyebrow: 'أهلًا بك في', title: 'Kadol Boutique', text: 'تجربة تسوق مختارة بعناية، تجمع الذوق والفخامة في مكان واحد.', tone: 'rose' },
  { eyebrow: 'اكتشف معنا', title: 'أشهر المتاجر العالمية في متجر واحد', text: 'اختيارات مميزة من مصادر موثوقة لتجد ما يناسب أسلوبك.', tone: 'sky' },
  { eyebrow: 'تسوق بذكاء', title: 'تشكيلات واسعة وأسعار مناسبة', text: 'كل ما تحبه، بتفاصيل واضحة وتجربة سهلة على الجوال والكمبيوتر.', tone: 'gold' },
];

const categoryDetails = {
  shoes: { title: 'قسم الأحذية', desc: 'اختيارات أنيقة وعملية من الأحذية الرياضية والكاجوال والكعب لتكمل إطلالتك في كل مناسبة.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80', product: { store: 'AMAZON', title: 'SKECHERS GO WALK ...LIDE-STEP 2.0 WOMEN', price: '253.08 رس' }, slides: ['خطوات مريحة لإطلالة يومية', 'أحذية رياضية بتصميم عصري', 'اختيارات تناسب كل مشاويرك'] },
  clothes: { title: 'قسم الملابس', desc: 'تشكيلات راقية تجمع بين الخامات الجميلة والتصاميم العصرية لتناسب ذوقك ومناسباتك المختلفة.', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=700&auto=format&fit=crop&q=80', product: { store: 'AMAZON', title: 'تشكيلة فساتين وملابس عصرية راقية', price: '320.00 رس' }, slides: ['أناقة تليق بك', 'فساتين وملابس لكل مناسبة', 'اختاري إطلالتك بثقة'] },
  bags: { title: 'قسم الشنط', desc: 'شنط أنيقة وعملية بتصميمات عالمية تمنح إطلالتك لمسة فاخرة في كل وقت.', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&auto=format&fit=crop&q=80', product: { store: 'AMAZON', title: 'حقيبة يد نسائية جلدية فاخرة', price: '215.50 رس' }, slides: ['تفاصيل صغيرة تصنع الفرق', 'شنط عملية بإطلالة فاخرة', 'اختاري حقيبتك المفضلة'] },
  beauty: { title: 'قسم العناية والجمال', desc: 'منتجات مختارة للعناية والتجميل تساعدك على إبراز جمالك ومنحك إشراقة يومية مميزة.', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700&auto=format&fit=crop&q=80', product: { store: 'AMAZON', title: 'مجموعة العناية والتجميل المتكاملة', price: '145.00 رس' }, slides: ['جمالك يبدأ من عنايتك', 'تألقي بإطلالة طبيعية', 'منتجاتك المفضلة في مكان واحد'] },
  perfumes: { title: 'قسم العطور', desc: 'عطور راقية بروائح مميزة وثبات جميل لتضيف لمظهرك حضورًا لا يُنسى.', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=700&auto=format&fit=crop&q=80', product: { store: 'AMAZON', title: 'عطور فاخرة بروائح ثابتة وراقية', price: '189.00 رس' }, slides: ['رائحة تحكي ذوقك', 'اختاري عطرك المميز', 'فخامة تدوم معك'] },
  kids: { title: 'قسم الأطفال', desc: 'تشكيلات لطيفة وعملية للصغار، من ملابس المواليد إلى إطلالات البنات والأولاد اليومية.', image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=700&auto=format&fit=crop&q=80', product: { store: 'AMAZON', title: 'تشكيلات أطفال لطيفة وعملية', price: '99.00 رس' }, slides: ['ألوان طفولية مبهجة', 'إطلالات للصغار بكل حب', 'اختيارات مريحة لكل يوم'] },
};

function Dots({ count, active }) {
  return <div className="banner-dots" aria-hidden="true">{Array.from({ length: count }, (_, index) => <span key={index} className={index === active ? 'active' : ''} />)}</div>;
}

function fitProductImage(event) {
  const image = event.currentTarget;
  if (image.naturalWidth && image.naturalHeight) image.parentElement.style.aspectRatio = `${image.naturalWidth} / ${image.naturalHeight}`;
}

function formatPrice(value, currency) {
  const original = String(value ?? '');
  if (currency === 'SOURCE') return original || 'غير متوفر';
  const normalized = original.replace(/[٠-٩]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit)).replace(/[^0-9.]/g, '');
  const amount = Number.parseFloat(normalized);
  if (!Number.isFinite(amount)) return value || 'غير محدد';
  const sourceIsUsd = /\$|usd|دولار/i.test(original);
  const sarAmount = sourceIsUsd ? amount * 3.75 : amount;
  return currency === 'USD' ? `${(sarAmount / 3.75).toFixed(2)} $` : `${sarAmount.toFixed(2)} رس`;
}

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [sectionSlides, setSectionSlides] = useState(Object.fromEntries(categories.map(({ id }) => [id, 0])));
  const [openCategory, setOpenCategory] = useState(null);
  const [activeBanner, setActiveBanner] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState('');
  const [activeChildBranch, setActiveChildBranch] = useState('');
  const [storeBannerIndex, setStoreBannerIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageSearchMessage, setImageSearchMessage] = useState('');
  const [publishedProducts, setPublishedProducts] = useState([]);
  const [currency, setCurrency] = useState('SOURCE');
  const sectionRefs = useRef({});
  const categoriesRef = useRef(null);
  const subcategoryRef = useRef(null);
  const kidsSectionRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!previewImage) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setPreviewImage(null); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [previewImage]);

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex((index) => (index + 1) % heroSlides.length), 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setStoreBannerIndex((index) => (index + 1) % storeNames.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/store/products').then((response) => response.json()).then((data) => setPublishedProducts(Array.isArray(data.products) ? data.products : [])).catch(() => setPublishedProducts([]));
  }, []);

  const visibleCategories = openCategory ? categories.filter((category) => category.id === openCategory) : categories;
  const activeCategory = categories.find((category) => category.id === openCategory);
  const activeDetail = activeCategory ? categoryDetails[activeCategory.id] : null;
  const activeProducts = activeCategory ? publishedProducts.filter((product) => product.category === activeCategory.name && (!activeSubcategory || product.branch === activeSubcategory)) : [];
  const searchResults = searchQuery.trim() ? publishedProducts.filter((product) => [product.title, product.description, product.store, product.category, product.branch].filter(Boolean).join(' ').toLocaleLowerCase('ar').includes(searchQuery.trim().toLocaleLowerCase('ar'))) : [];

  useEffect(() => {
    const timer = setInterval(() => {
      setSectionSlides((current) => Object.fromEntries(Object.entries(current).map(([id, index]) => [id, (index + 1) % categoryDetails[id].slides.length])));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!openCategory) return undefined;
    const timer = window.setTimeout(() => subcategoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
    return () => window.clearTimeout(timer);
  }, [openCategory]);

  useEffect(() => {
    if (!activeChildBranch) return undefined;
    const timer = window.setTimeout(() => kidsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
    return () => window.clearTimeout(timer);
  }, [activeChildBranch]);

  const selectCategory = (category) => {
    const isClosing = openCategory === category.id;
    setOpenCategory(isClosing ? null : category.id);
    setActiveSubcategory('');
    setActiveChildBranch('');
  };

  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedImage(URL.createObjectURL(file));
    setImageSearchMessage('تم اختيار الصورة. البحث البصري يحتاج مطابقة صور بالذكاء الاصطناعي، وهو غير مفعّل في النسخة الحالية حتى لا نعرض نتائج غير صحيحة.');
  };

  return (
    <main className="store-shell" dir="rtl">
      <div className="store-container">
        <header className="store-header">
          <Link href="/" className="brand-block" aria-label="العودة إلى الصفحة الرئيسية لمتجر كادل"><span className="brand-mark">K</span><h1>Kadel</h1><span className="brand-arabic">متجر</span></Link>
          <div className="search-box">
            <Search aria-hidden="true" />
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="ابحث عن منتجك المفضل..." aria-label="البحث عن منتج" />
            <button type="button" className="camera-button" onClick={() => fileInputRef.current?.click()} aria-label="البحث بالصورة"><Camera aria-hidden="true" /></button>
            <input ref={fileInputRef} className="hidden-file-input" type="file" accept="image/*" onChange={chooseImage} />
          </div>
        </header>
        <div className="boutique-intro"><strong>THE BOUTIQUE</strong><span>Curated style, made for every occasion</span></div>
        {selectedImage && <div className="image-search-status"><ImageIcon aria-hidden="true" /><span>تم اختيار صورة للبحث</span><button type="button" onClick={() => { setSelectedImage(null); setImageSearchMessage(''); }}>إزالة</button></div>}
        {imageSearchMessage && <p className="image-search-message">{imageSearchMessage}</p>}

        <div className="currency-bar"><span>العملة</span><div className="currency-switch" aria-label="تحويل العملة"><button type="button" className={currency === 'SOURCE' ? 'active' : ''} onClick={() => setCurrency('SOURCE')}>الأصلي</button><button type="button" className={currency === 'SAR' ? 'active' : ''} onClick={() => setCurrency('SAR')}>ر.س</button><button type="button" className={currency === 'USD' ? 'active' : ''} onClick={() => setCurrency('USD')}>$</button></div></div>
        {searchQuery.trim() && <section className="search-results-panel" aria-label="نتائج البحث"><div className="search-results-heading"><strong>نتائج البحث عن: {searchQuery}</strong><span>{searchResults.length} منتج</span></div>{searchResults.length ? <div className="search-results-grid">{searchResults.map((product) => <article className="search-result-card" key={product.id || product.title}><img src={product.image} alt={product.title} /><div><span>{product.store}</span><h2>{product.title}</h2><p>{formatPrice(product.price, currency)}</p>{product.url && <a href={product.url} target="_blank" rel="noreferrer">شراء المنتج</a>}</div></article>)}</div> : <p className="search-empty">لم نعثر على منتج بهذه الكلمة.</p>}</section>}

        <section className={`hero-banner hero-${heroSlides[heroIndex].tone}`} aria-label="رسائل متجر كادل">
          <div className="hero-content"><span>{heroSlides[heroIndex].eyebrow}</span><h2>{heroSlides[heroIndex].title}</h2><p>{heroSlides[heroIndex].text}</p></div>
          <div className="hero-sparkles">✦ ✧ ✦</div><Dots count={heroSlides.length} active={heroIndex} />
        </section>

        <section className="global-stores-banner" aria-label="أشهر المتاجر العالمية">
          <span className="global-stores-kicker">تسوق من أشهر المتاجر العالمية</span>
          <strong>{storeNames[storeBannerIndex]}</strong>
          <span className="global-stores-note">متجر عالمي واحد في كل مرة، وتجربة هادئة بلا ازدحام بصري</span>
          <Dots count={storeNames.length} active={storeBannerIndex} />
        </section>

        <section className="lady-intro lady-banner" aria-label="رسالة كادل للسيدات"><span className="lady-intro-line" /><div><strong>لكِ أنتِ سيدتي</strong><p>انتقينا لكِ تشكيلة واسعة بعناية وبحب</p></div><span className="lady-intro-line" /><nav ref={categoriesRef} className="categories lady-categories" aria-label="أقسام المتجر">{categories.map((category) => <button type="button" key={category.id} className={`category-pill ${activeBanner === category.id ? 'category-pill-sky' : openCategory === category.id ? 'category-pill-active' : ''}`} onClick={() => selectCategory(category)}><span>{category.name}</span><span className="category-icon">{category.icon}</span>{category.subcategories.length > 0 && <ChevronDown className={`category-chevron ${openCategory === category.id ? 'rotate' : ''}`} aria-hidden="true" />}</button>)}</nav></section>

        <div ref={subcategoryRef} className={`subcategory-panel ${openCategory && activeCategory ? "subcategory-panel-open" : ""}`}><div className="subcategory-panel-content">{openCategory && activeCategory && <><div className="subcategory-heading"><span>{activeCategory.subcategories.length ? `فروع ${activeCategory.name}` : activeCategory.name}</span><span className="subcategory-count">{activeCategory.subcategories.length ? 'اختر الفرع' : 'المنتجات'}</span></div>{activeCategory.subcategories.length > 0 && <div className="subcategory-list">{activeCategory.subcategories.map((subcategory) => <button type="button" key={subcategory} className={`subcategory-pill ${activeSubcategory === subcategory ? 'subcategory-pill-active' : ''}`} onClick={() => setActiveSubcategory(activeSubcategory === subcategory ? '' : subcategory)}>{subcategory}</button>)}</div>}{activeSubcategory || activeCategory.subcategories.length === 0 ? (activeProducts.length ? <div className="branch-products-grid">{activeProducts.map((product) => <article className="product-card" key={product.id || product.title}><div className="product-information"><span className="store-label">{product.store}</span><h3>{product.title}</h3><p className="product-price">{formatPrice(product.price, currency)}</p>{product.url && <a className="buy-product-button" href={product.url} target="_blank" rel="noreferrer">🛍️ شراء المنتج</a>}</div><div className="product-image-wrapper product-image-button" role="button" tabIndex="0" aria-label={`تكبير صورة ${product.title}`} onClick={() => setPreviewImage({ src: product.image || activeDetail?.image, title: product.title })} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setPreviewImage({ src: product.image || activeDetail?.image, title: product.title }); }}><img src={product.image || activeDetail?.image} alt={product.title} onLoad={fitProductImage} /></div></article>)}</div> : <p className="branch-empty-message">لا توجد منتجات مضافة لهذا الفرع حاليًا.</p>) : <p className="branch-prompt">اختر الفرع لعرض المنتجات</p>}</>}</div></div>
        <section ref={kidsSectionRef} className="kids-store-section" aria-label="قسم الأطفال">
          <div className="kids-store-heading"><div><span>🧸</span><h2>قسم الأطفال</h2></div><p>اختيارات لطيفة ومريحة للصغار بكل ألوان الطفولة</p></div>
          <div className="kids-main-branches">{['مواليد', 'بناتي', 'ولادي'].map((branch) => <button type="button" key={branch} className={`kids-main-branch ${activeChildBranch === branch ? 'active' : ''}`} onClick={() => { setActiveChildBranch(activeChildBranch === branch ? '' : branch); setActiveSubcategory(''); }}>{branch}</button>)}</div>
          {activeChildBranch && childSubcategories[activeChildBranch] && <div className="kids-subcategory-list kids-store-subcategories"><span>اختيارات {activeChildBranch}</span>{childSubcategories[activeChildBranch].map((subcategory) => <button type="button" key={subcategory} className={`subcategory-pill ${activeSubcategory === subcategory ? 'subcategory-pill-active' : ''}`} onClick={() => setActiveSubcategory(activeSubcategory === subcategory ? '' : subcategory)}>{subcategory}</button>)}</div>}
        </section>


      </div>
      {previewImage && <div className="product-preview-overlay" role="presentation" onClick={() => setPreviewImage(null)}><div className="product-preview-card" role="dialog" aria-modal="true" aria-label={previewImage.title} onClick={(event) => event.stopPropagation()}><button type="button" className="product-preview-close" aria-label="إغلاق الصورة" onClick={() => setPreviewImage(null)}>×</button><img src={previewImage.src} alt={previewImage.title} /></div></div>}
    </main>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
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
  { eyebrow: 'أهلًا بك في', title: 'متجر كادل الراقي', text: 'تجربة تسوق مختارة بعناية، تجمع الذوق والفخامة في مكان واحد.', tone: 'rose' },
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
  const [imageSearchMessage, setImageSearchMessage] = useState('');
  const [publishedProducts, setPublishedProducts] = useState([]);
  const [currency, setCurrency] = useState('SOURCE');
  const sectionRefs = useRef({});
  const categoriesRef = useRef(null);
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setSectionSlides((current) => Object.fromEntries(Object.entries(current).map(([id, index]) => [id, (index + 1) % categoryDetails[id].slides.length])));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
    setImageSearchMessage('تم اختيار الصورة، وسيتم ربط البحث البصري بالمنتجات عند تجهيز أداة الأدمن.');
  };

  return (
    <main className="store-shell" dir="rtl">
      <div className="store-container">
        <header className="store-header">
          <div className="brand-block"><span className="brand-mark">K</span><h1>Kadel</h1><span className="brand-arabic">متجر</span></div>
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

        <section className="kids-store-section" aria-label="قسم الأطفال">
          <div className="kids-store-heading"><div><span>🧸</span><h2>قسم الأطفال</h2></div><p>اختيارات لطيفة ومريحة للصغار بكل ألوان الطفولة</p></div>
          <div className="kids-main-branches">{['مواليد', 'بناتي', 'ولادي'].map((branch) => <button type="button" key={branch} className={`kids-main-branch ${activeChildBranch === branch ? 'active' : ''}`} onClick={() => { setActiveChildBranch(activeChildBranch === branch ? '' : branch); setActiveSubcategory(''); }}>{branch}</button>)}</div>
          {activeChildBranch && childSubcategories[activeChildBranch] && <div className="kids-subcategory-list kids-store-subcategories"><span>اختيارات {activeChildBranch}</span>{childSubcategories[activeChildBranch].map((subcategory) => <button type="button" key={subcategory} className={`subcategory-pill ${activeSubcategory === subcategory ? 'subcategory-pill-active' : ''}`} onClick={() => setActiveSubcategory(activeSubcategory === subcategory ? '' : subcategory)}>{subcategory}</button>)}</div>}
        </section>

        <nav ref={categoriesRef} className="categories" aria-label="أقسام المتجر">
          {categories.map((category) => <button type="button" key={category.id} className={`category-pill ${activeBanner === category.id ? 'category-pill-sky' : openCategory === category.id ? 'category-pill-active' : ''}`} onClick={() => selectCategory(category)}><span>{category.name}</span><span className="category-icon">{category.icon}</span>{category.subcategories.length > 0 && <ChevronDown className={`category-chevron ${openCategory === category.id ? 'rotate' : ''}`} aria-hidden="true" />}</button>)}
        </nav>

        {openCategory && categories.find((category) => category.id === openCategory)?.subcategories.length > 0 && <div className={`subcategory-panel ${openCategory === 'kids' ? 'kids-subcategory-panel' : ''}`}><div className="subcategory-heading"><span>فروع {categories.find((category) => category.id === openCategory).name}</span><span className="subcategory-count">اختر الفرع</span></div><div className="subcategory-list">{categories.find((category) => category.id === openCategory).subcategories.map((subcategory) => <button type="button" key={subcategory} className={`subcategory-pill ${activeChildBranch === subcategory || activeSubcategory === subcategory ? 'subcategory-pill-active' : ''}`} onClick={() => { setActiveChildBranch(subcategory); setActiveSubcategory(childSubcategories[subcategory] ? '' : subcategory); }}>{subcategory}</button>)}</div>{openCategory === 'kids' && activeChildBranch && childSubcategories[activeChildBranch] && <div className="kids-subcategory-list"><span>اختيارات {activeChildBranch}</span>{childSubcategories[activeChildBranch].map((subcategory) => <button type="button" key={subcategory} className={`subcategory-pill ${activeSubcategory === subcategory ? 'subcategory-pill-active' : ''}`} onClick={() => setActiveSubcategory(subcategory)}>{subcategory}</button>)}</div>}</div>}

        <div className="sections-list">
          {visibleCategories.map((category) => {
            const detail = categoryDetails[category.id];
            const slideIndex = sectionSlides[category.id];
            const selectedBranch = activeSubcategory;
            const categoryProducts = publishedProducts.filter((product) => product.category === category.name && (!selectedBranch || product.branch === selectedBranch));
            const productsToShow = categoryProducts.length ? categoryProducts : [{ ...detail.product, image: detail.image }];
            return <section key={category.id} ref={(element) => { sectionRefs.current[category.id] = element; }} className={`category-card ${activeBanner === category.id ? 'category-card-highlighted' : ''}`} id={category.id}>
              <div className="section-heading"><div className="section-title-row"><span className="section-accent"><Sparkles aria-hidden="true" /></span><h2>{detail.title}</h2></div>{selectedBranch && openCategory === category.id && <span className="selected-label">{selectedBranch}</span>}</div>
              <p className="section-description">{detail.desc}</p>
              <div className="products-grid">{productsToShow.map((product) => <article className="product-card" key={product.id || product.title}><div className="product-information"><span className="store-label">{product.store}</span><h3>{product.title}</h3><p className="product-price">{formatPrice(product.price, currency)}</p>{product.url && <a className="buy-product-button" href={product.url} target="_blank" rel="noreferrer">🛍️ شراء المنتج</a>}</div><div className="product-image-wrapper"><img src={product.image || detail.image} alt={product.title} onLoad={fitProductImage} /></div></article>)}</div>
            </section>;
          })}
        </div>
      </div>
    </main>
  );
}

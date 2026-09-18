'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, ChevronDown, Image as ImageIcon, MessageCircle, Search, Sparkles } from 'lucide-react';

const categories = [
  { id: 'shoes', name: 'الأحذية', icon: '👠', subcategories: ['أحذية رياضية', 'أحذية مشي', 'أحذية كعب', 'أحذية كاجوال'] },
  { id: 'clothes', name: 'الملابس', icon: '👗', subcategories: ['فساتين', 'بلوزات', 'فساتين سهرات', 'جينزات', 'ملابس داخلية', 'سراويل'] },
  { id: 'bags', name: 'الشنط', icon: '👜', subcategories: ['شنط كتف', 'شنط سهرات', 'شنط يد'] },
  { id: 'beauty', name: 'العناية والجمال', icon: '💄', subcategories: ['مكياج وتجميل', 'العناية بالشعر', 'العناية بالبشرة'] },
  { id: 'perfumes', name: 'العطور', icon: '🌸', subcategories: [] },
];

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
};

function Dots({ count, active }) {
  return <div className="banner-dots" aria-hidden="true">{Array.from({ length: count }, (_, index) => <span key={index} className={index === active ? 'active' : ''} />)}</div>;
}

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [sectionSlides, setSectionSlides] = useState(Object.fromEntries(categories.map(({ id }) => [id, 0])));
  const [openCategory, setOpenCategory] = useState('shoes');
  const [activeSubcategory, setActiveSubcategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSearchMessage, setImageSearchMessage] = useState('');
  const sectionRefs = useRef({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex((index) => (index + 1) % heroSlides.length), 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSectionSlides((current) => Object.fromEntries(Object.entries(current).map(([id, index]) => [id, (index + 1) % categoryDetails[id].slides.length])));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const selectCategory = (category) => {
    setOpenCategory(category.id);
    setActiveSubcategory('');
    sectionRefs.current[category.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedImage(URL.createObjectURL(file));
    setImageSearchMessage('تم اختيار الصورة، وسيتم ربط البحث البصري بالمنتجات عند تجهيز أداة الأدمن.');
  };

  const shareOnWhatsApp = (product) => {
    const text = `مرحبًا، أريد معرفة تفاصيل هذا المنتج: ${product.title} - ${product.price}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="store-shell" dir="rtl">
      <div className="store-container">
        <header className="store-header">
          <div className="brand-block"><span className="brand-mark">K</span><h1>KADEL</h1><span className="brand-arabic">متجر</span></div>
          <div className="search-box">
            <Search aria-hidden="true" />
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="ابحث عن منتجك المفضل..." aria-label="البحث عن منتج" />
            <button type="button" className="camera-button" onClick={() => fileInputRef.current?.click()} aria-label="البحث بالصورة"><Camera aria-hidden="true" /></button>
            <input ref={fileInputRef} className="hidden-file-input" type="file" accept="image/*" onChange={chooseImage} />
          </div>
        </header>
        {selectedImage && <div className="image-search-status"><ImageIcon aria-hidden="true" /><span>تم اختيار صورة للبحث</span><button type="button" onClick={() => { setSelectedImage(null); setImageSearchMessage(''); }}>إزالة</button></div>}
        {imageSearchMessage && <p className="image-search-message">{imageSearchMessage}</p>}

        <section className={`hero-banner hero-${heroSlides[heroIndex].tone}`} aria-label="رسائل متجر كادل">
          <div className="hero-content"><span>{heroSlides[heroIndex].eyebrow}</span><h2>{heroSlides[heroIndex].title}</h2><p>{heroSlides[heroIndex].text}</p></div>
          <div className="hero-sparkles">✦ ✧ ✦</div><Dots count={heroSlides.length} active={heroIndex} />
        </section>

        <nav className="categories" aria-label="أقسام المتجر">
          {categories.map((category) => <button type="button" key={category.id} className={`category-pill ${openCategory === category.id ? 'category-pill-active' : ''}`} onClick={() => selectCategory(category)}><span>{category.name}</span><span className="category-icon">{category.icon}</span>{category.subcategories.length > 0 && <ChevronDown className={`category-chevron ${openCategory === category.id ? 'rotate' : ''}`} aria-hidden="true" />}</button>)}
        </nav>

        {openCategory && categories.find((category) => category.id === openCategory)?.subcategories.length > 0 && <div className="subcategory-panel"><div className="subcategory-heading"><span>فروع {categories.find((category) => category.id === openCategory).name}</span><span className="subcategory-count">اختر الفرع</span></div><div className="subcategory-list">{categories.find((category) => category.id === openCategory).subcategories.map((subcategory) => <button type="button" key={subcategory} className={`subcategory-pill ${activeSubcategory === subcategory ? 'subcategory-pill-active' : ''}`} onClick={() => setActiveSubcategory(subcategory)}>{subcategory}</button>)}</div></div>}

        <div className="sections-list">
          {categories.map((category) => {
            const detail = categoryDetails[category.id];
            const slideIndex = sectionSlides[category.id];
            return <section key={category.id} ref={(element) => { sectionRefs.current[category.id] = element; }} className={`category-card ${openCategory === category.id ? 'category-card-highlighted' : ''}`} id={category.id}>
              <div className="section-heading"><div className="section-title-row"><span className="section-accent"><Sparkles aria-hidden="true" /></span><h2>{detail.title}</h2></div>{activeSubcategory && openCategory === category.id && <span className="selected-label">{activeSubcategory}</span>}</div>
              <p className="section-description">{detail.desc}</p>
              <button type="button" className="section-banner" onClick={() => { setOpenCategory(category.id); window.scrollTo({ top: sectionRefs.current[category.id]?.offsetTop - 20, behavior: 'smooth' }); }}><div><span>مختارات كادل</span><strong>{detail.slides[slideIndex]}</strong><small>اكتشف التشكيلة الآن ←</small></div><img src={detail.image} alt="" /><Dots count={detail.slides.length} active={slideIndex} /></button>
              <article className="product-card"><div className="product-information"><span className="store-label">{detail.product.store}</span><h3>{detail.product.title}</h3><p className="product-price">{detail.product.price}</p><div className="product-footer"><span className="product-rating">مختار لك بعناية</span><button type="button" className="view-category-button">🔍 عرض القسم</button></div><button type="button" className="whatsapp-button" onClick={() => shareOnWhatsApp(detail.product)}><MessageCircle aria-hidden="true" /> مشاركة عبر واتساب</button></div><div className="product-image-wrapper"><img src={detail.image} alt={detail.product.title} /></div></article>
            </section>;
          })}
        </div>
      </div>
    </main>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Edit3, Link2, LockKeyhole, LogIn, Plus, Search, Store, Trash2 } from 'lucide-react';

const stores = ['SHEIN', 'Amazon', 'Temu', 'AliExpress', 'نون', 'نمشي', 'ترينديول'];
const childSubcategories = { بناتي: ['فساتين', 'ملابس داخلية', 'أحذية', 'كماليات', 'بناطيل', 'تيشرتات'], ولادي: ['أطقم', 'ملابس داخلية', 'أحذية', 'تيشرتات', 'بناطيل'] };
const categories = [
  { name: 'الأحذية', branches: ['أحذية رياضية', 'أحذية مشي', 'أحذية كعب', 'أحذية كاجوال'] },
  { name: 'الملابس', branches: ['فساتين', 'بلوزات', 'فساتين سهرات', 'جينزات', 'ملابس داخلية', 'سراويل'] },
  { name: 'الشنط', branches: ['شنط كتف', 'شنط سهرات', 'شنط يد'] },
  { name: 'العناية والجمال', branches: ['مكياج وتجميل', 'العناية بالشعر', 'العناية بالبشرة'] },
  { name: 'العطور', branches: [] },
  { name: 'الأطفال', branches: ['مواليد', 'بناتي', 'ولادي'] },
];

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [store, setStore] = useState(stores[0]);
  const [category, setCategory] = useState(categories[0].name);
  const [branch, setBranch] = useState(categories[0].branches[0]);
  const [childBranch, setChildBranch] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [productDraft, setProductDraft] = useState({ title: '', price: '', image: '', description: '' });
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [openFolders, setOpenFolders] = useState({});
  const [checkingSession, setCheckingSession] = useState(true);

  const selectedCategory = categories.find((item) => item.name === category) || categories[0];
  const filteredProducts = useMemo(() => products.filter((product) => [product.title, product.store, product.category, product.branch].join(' ').toLowerCase().includes(search.toLowerCase())), [products, search]);
  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce((groups, product) => {
      const categoryName = product.category || 'بدون قسم';
      const branchName = product.branch || 'بدون فرع';
      groups[categoryName] ||= {};
      groups[categoryName][branchName] ||= [];
      groups[categoryName][branchName].push(product);
      return groups;
    }, {});
  }, [filteredProducts]);

  useEffect(() => {
    fetch('/api/admin/session').then((response) => response.json()).then((data) => setLoggedIn(data.authenticated === true)).catch(() => setLoggedIn(false)).finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    fetch('/api/admin/products').then((response) => response.json()).then((data) => { if (Array.isArray(data.products)) setProducts(data.products); else if (data.error) setNotice(data.error); }).catch(() => setNotice('تعذر الاتصال بقاعدة المنتجات.'));
  }, [loggedIn]);

  const login = async (event) => {
    event.preventDefault();
    if (!credentials.username || !credentials.password) return setNotice('اكتب اسم المستخدم وكلمة المرور للمتابعة.');
    setNotice('جارٍ التحقق...');
    const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return setNotice(data.error || 'تعذر تسجيل الدخول.');
    setLoggedIn(true);
    setNotice('تم تسجيل الدخول بنجاح.');
  };

  const changeCategory = (value) => {
    const next = categories.find((item) => item.name === value) || categories[0];
    setCategory(next.name);
    if (next.name === 'الأطفال') {
      const mainBranch = next.branches[0] || 'مواليد';
      setChildBranch(mainBranch);
      setBranch(childSubcategories[mainBranch]?.[0] || mainBranch);
    } else {
      setChildBranch('');
      setBranch(next.branches[0] || 'بدون فرع');
    }
  };

  const changeChildBranch = (value) => {
    setChildBranch(value);
    setBranch(childSubcategories[value]?.[0] || value);
  };

  const startScrape = async (event) => {
    event.preventDefault();
    if (!productUrl.trim()) return setNotice('ألصق رابط المنتج أولًا.');
    setNotice(`جارٍ السحب من ${store}...`);
    const response = await fetch('/api/admin/scrape', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: productUrl, store, category, branch }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return setNotice(data.error || 'تعذر سحب المنتج.');
    setProductDraft({ title: data.product.title || '', price: data.product.price || '', image: data.product.image || '', description: data.product.description || '' });
    setNotice('تم سحب البيانات إلى الحقول. راجعها ثم أضفها إلى حافظات المتجر.');
  };

  const addProductToStore = async () => {
    if (!productUrl.trim() || !productDraft.title.trim() || !productDraft.price.trim() || !productDraft.image.trim()) return setNotice('أكمل رابط العمولة واسم المنتج والسعر ورابط الصورة أولًا.');
    if (products.some((product) => product.url?.trim() === productUrl.trim())) return setNotice('هذا الرابط والمنتج موجودان من قبل داخل المتجر.');
    const response = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: productDraft.title.trim(), price: productDraft.price.trim(), image: productDraft.image.trim(), description: productDraft.description.trim(), url: productUrl.trim(), store, category, branch }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return setNotice(data.error || 'تعذر حفظ المنتج.');
    setProducts((current) => [data.product, ...current]);
    setOpenFolders((current) => ({ ...current, [`${category}::${branch}`]: true }));
    setProductUrl('');
    setProductDraft({ title: '', price: '', image: '', description: '' });
    setNotice(`تمت إضافة المنتج ونشره فورًا داخل ${category} / ${branch}.`);
  };

  const deleteProduct = async (id) => {
    const response = await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (!response.ok) return setNotice('تعذر حذف المنتج من قاعدة البيانات.');
    setProducts((current) => current.filter((product) => product.id !== id));
    setNotice('تم حذف المنتج نهائيًا من المتجر والحافظة.');
  };

  const publishProduct = async (id) => {
    const response = await fetch('/api/admin/products', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'published' }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return setNotice(data.error || 'تعذر نشر المنتج في المتجر.');
    setProducts((current) => current.map((product) => product.id === id ? { ...product, ...(data.product || {}), status: 'منشور' } : product));
    setNotice('تم نشر المنتج فورًا في المتجر.');
  };

  const saveEdit = async (id, field, value) => {
    const response = await fetch('/api/admin/products', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, [field]: value }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return setNotice(data.error || 'تعذر حفظ التعديل.');
    setProducts((current) => current.map((product) => product.id === id ? { ...product, ...(data.product || {}), [field]: value } : product));
    setEditingId(null);
    setNotice('تم حفظ التعديل.');
  };

  const toggleFolder = (key) => setOpenFolders((current) => ({ ...current, [key]: !current[key] }));
  const logout = async () => { await fetch('/api/admin/session', { method: 'DELETE' }); setLoggedIn(false); };

  if (checkingSession) return <main className="admin-page" dir="rtl"><div className="admin-login-card"><p className="admin-kicker">Kadel admin</p><h1>جارٍ التحقق من الجلسة</h1></div></main>;
  if (!loggedIn) return <main className="admin-page" dir="rtl"><div className="admin-login-card"><div className="admin-logo"><LockKeyhole /></div><p className="admin-kicker">Kadel admin</p><h1>مرحبًا بك في Kadel admin</h1><p className="admin-muted">سجّل الدخول لإدارة المتاجر والأقسام والمنتجات.</p><form onSubmit={login} className="admin-form"><label>اسم المستخدم<input value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} placeholder="اسم المستخدم" autoComplete="username" /></label><label>كلمة المرور<input type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} placeholder="كلمة المرور" autoComplete="current-password" /></label><button className="admin-primary-button" type="submit"><LogIn /> دخول لوحة التحكم</button></form>{notice && <p className="admin-notice">{notice}</p>}</div></main>;

  return <main className="admin-page" dir="rtl"><div className="admin-container"><header className="admin-header"><div><p className="admin-kicker">Kadel admin</p><h1>لوحة إدارة المتجر</h1><p className="admin-muted">التنزيلات محفوظة داخل حافظات الأقسام والفروع. انشر المنتج ليظهر فورًا في المتجر.</p></div><button className="admin-outline-button" type="button" onClick={logout}>تسجيل الخروج</button></header>
    <section className="admin-stats"><div><span>المتاجر المدعومة</span><strong>{stores.length}</strong></div><div><span>كل التنزيلات</span><strong>{products.length}</strong></div><div><span>الفروع</span><strong>{categories.reduce((sum, item) => sum + item.branches.length, 0)}</strong></div></section>
    <section className="admin-panel"><div className="panel-heading"><div><h2><Link2 /> إضافة منتج من رابط العمولة</h2><p>اختر القسم والفرع، وسيتم حفظ المنتج تلقائيًا داخلهما بعد الإضافة.</p></div><span className="safe-label">رابط عمولة خاص بك</span></div><form onSubmit={startScrape} className="scrape-grid"><label>المتجر<select value={store} onChange={(event) => setStore(event.target.value)}>{stores.map((item) => <option key={item}>{item}</option>)}</select></label><label>القسم<select value={category} onChange={(event) => changeCategory(event.target.value)}>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>{category === 'الأطفال' ? <><label>قسم الأطفال<select value={childBranch} onChange={(event) => changeChildBranch(event.target.value)}>{selectedCategory.branches.map((item) => <option key={item}>{item}</option>)}</select></label>{childSubcategories[childBranch] ? <label>الفرع الفرعي<select value={branch} onChange={(event) => setBranch(event.target.value)}>{childSubcategories[childBranch].map((item) => <option key={item}>{item}</option>)}</select></label> : <input type="hidden" value={branch} readOnly />}</> : <label>الفرع<select value={branch} onChange={(event) => setBranch(event.target.value)}>{(selectedCategory.branches.length ? selectedCategory.branches : ['بدون فرع']).map((item) => <option key={item}>{item}</option>)}</select></label>}<label className="url-field">رابط العمولة<input value={productUrl} onChange={(event) => setProductUrl(event.target.value)} placeholder="ألصق رابط العمولة هنا" type="url" dir="ltr" /></label><button className="admin-primary-button scrape-button" type="submit"><Link2 /> سحب البيانات من الرابط</button></form><div className="manual-product-fields"><label>اسم المنتج<input value={productDraft.title} onChange={(event) => setProductDraft({ ...productDraft, title: event.target.value })} placeholder="اكتب اسم المنتج" /></label><label>السعر<input value={productDraft.price} onChange={(event) => setProductDraft({ ...productDraft, price: event.target.value })} placeholder="$19.99 أو 75 SAR" /></label><label>صورة المنتج<input value={productDraft.image} onChange={(event) => setProductDraft({ ...productDraft, image: event.target.value })} placeholder="https://رابط-الصورة" type="url" dir="ltr" /></label><label className="description-field">وصف المنتج<input value={productDraft.description} onChange={(event) => setProductDraft({ ...productDraft, description: event.target.value })} placeholder="وصف مختصر اختياري" /></label><button className="admin-add-button" type="button" onClick={addProductToStore}><Plus /> إضافة إلى المتجر</button></div></section>
    <section className="admin-panel downloads-panel"><div className="panel-heading"><div><h2><Store /> حافظات تنزيلات المتجر</h2><p>كل منتج تتم إضافته يُنشر فورًا. افتح القسم ثم الفرع، وستجد أمام المنتج تعديل وحذف فقط.</p></div><div className="admin-search"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="بحث في الحافظات" /></div></div>
      {filteredProducts.length === 0 ? <div className="empty-products">لا توجد منتجات محفوظة بعد.</div> : <div className="download-folders">{Object.entries(groupedProducts).map(([categoryName, branches]) => <details key={categoryName} className="download-category" open><summary><span><Store /> {categoryName}</span><b>{Object.values(branches).flat().length}</b></summary><div className="download-branches">{Object.entries(branches).map(([branchName, branchProducts]) => { const folderKey = `${categoryName}::${branchName}`; return <details key={folderKey} className="download-branch" open={openFolders[folderKey] === true} onToggle={(event) => { if (event.currentTarget.open !== openFolders[folderKey]) toggleFolder(folderKey); }}><summary><span><ChevronDown /> {branchName}</span><b>{branchProducts.length}</b></summary><div className="download-items">{branchProducts.map((product) => <article className="download-item" key={product.id}><div className="download-item-main"><div className="product-thumb">{product.image && <img src={product.image} alt="" />}</div><div><strong>{editingId === product.id ? <input className="inline-edit" defaultValue={product.title} onBlur={(event) => saveEdit(product.id, 'title', event.target.value)} autoFocus /> : product.title}</strong><small>{product.store} · {product.price || 'السعر غير محدد'}</small><em className="published-badge">منشور</em></div></div><div className="download-item-actions"><button type="button" title="تعديل السعر أو الاسم" onClick={() => setEditingId(product.id)}><Edit3 /> تعديل</button><button type="button" className="delete-store-button" title="حذف المنتج" onClick={() => deleteProduct(product.id)}><Trash2 /> حذف</button>{editingId === product.id && <input className="inline-edit price-edit" defaultValue={product.price} onBlur={(event) => saveEdit(product.id, 'price', event.target.value)} aria-label="السعر" />}</div></article>)}</div></details>; })}</div></details>)}</div>}
    </section>
    {notice && <p className="admin-notice">{notice}</p>}
  </div></main>;
}

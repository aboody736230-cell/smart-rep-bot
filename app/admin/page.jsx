'use client';

import { useEffect, useMemo, useState } from 'react';
import { Edit3, ExternalLink, Filter, Link2, LockKeyhole, LogIn, Plus, Save, Search, Store, Trash2, UploadCloud } from 'lucide-react';

const stores = ['SHEIN', 'Amazon', 'Temu', 'AliExpress', 'نون', 'نمشي', 'ترينديول'];
const categories = [
  { name: 'الأحذية', branches: ['أحذية رياضية', 'أحذية مشي', 'أحذية كعب', 'أحذية كاجوال'] },
  { name: 'الملابس', branches: ['فساتين', 'بلوزات', 'فساتين سهرات', 'جينزات', 'ملابس داخلية', 'سراويل'] },
  { name: 'الشنط', branches: ['شنط كتف', 'شنط سهرات', 'شنط يد'] },
  { name: 'العناية والجمال', branches: ['مكياج وتجميل', 'العناية بالشعر', 'العناية بالبشرة'] },
  { name: 'العطور', branches: [] },
];

const initialProducts = [];

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [store, setStore] = useState(stores[0]);
  const [category, setCategory] = useState(categories[0].name);
  const [branch, setBranch] = useState(categories[0].branches[0]);
  const [productUrl, setProductUrl] = useState('');
  const [productDraft, setProductDraft] = useState({ title: '', price: '', image: '', description: '' });
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const selectedCategory = categories.find((item) => item.name === category) || categories[0];
  const filteredProducts = useMemo(() => products.filter((product) => [product.title, product.store, product.category, product.branch].join(' ').toLowerCase().includes(search.toLowerCase())), [products, search]);

  useEffect(() => {
    fetch('/api/admin/session').then((response) => response.json()).then((data) => setLoggedIn(data.authenticated === true)).catch(() => setLoggedIn(false)).finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    fetch('/api/admin/products').then((response) => response.json()).then((data) => { if (Array.isArray(data.products)) setProducts(data.products); else if (data.error) setNotice(data.error); }).catch(() => setNotice('تعذر الاتصال بقاعدة المنتجات.'));
  }, [loggedIn]);

  const login = async (event) => {
    event.preventDefault();
    if (!credentials.username || !credentials.password) {
      setNotice('اكتب اسم المستخدم وكلمة المرور للمتابعة.');
      return;
    }
    setNotice('جارٍ التحقق...');
    const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setNotice(data.error || 'تعذر تسجيل الدخول.'); return; }
    setLoggedIn(true);
    setNotice('تم تسجيل الدخول بنجاح.');
  };

  const changeCategory = (value) => {
    const next = categories.find((item) => item.name === value) || categories[0];
    setCategory(next.name);
    setBranch(next.branches[0] || 'بدون فرع');
  };

  const startScrape = async (event) => {
    event.preventDefault();
    if (!productUrl.trim()) {
      setNotice('ألصق رابط المنتج أولًا.');
      return;
    }
    setNotice(`جارٍ السحب من ${store}...`);
    const response = await fetch('/api/admin/scrape', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: productUrl, store, category, branch }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setNotice(data.error || 'تعذر سحب المنتج.'); return; }
    setProductDraft({ title: data.product.title || '', price: data.product.price || '', image: data.product.image || '', description: data.product.description || '' });
    setNotice('تم سحب البيانات إلى الحقول. راجعها وعدّلها ثم اضغط «إضافة إلى المتجر».');
  };

  const addProductToStore = async (event) => {
    event.preventDefault();
    if (!productUrl.trim() || !productDraft.title.trim() || !productDraft.price.trim() || !productDraft.image.trim()) {
      setNotice('أكمل رابط العمولة واسم المنتج والسعر ورابط الصورة أولًا.');
      return;
    }
    const response = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: productDraft.title.trim(), price: productDraft.price.trim(), image: productDraft.image.trim(), description: productDraft.description.trim(), url: productUrl.trim(), store, category, branch }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setNotice(data.error || 'تعذر حفظ المنتج.'); return; }
    setProducts((current) => [data.product, ...current]);
    setProductUrl('');
    setProductDraft({ title: '', price: '', image: '', description: '' });
    setNotice(`تمت إضافة المنتج إلى ${category} / ${branch} كمسودة. يمكنك مراجعته من قائمة المنتجات.`);
  };

  const deleteProduct = async (id) => {
    const response = await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (!response.ok) { setNotice('تعذر حذف المنتج من قاعدة البيانات.'); return; }
    setProducts((current) => current.filter((product) => product.id !== id));
    setNotice('تم حذف المنتج من قائمة العرض الحالية.');
  };

  const publishProduct = async (id) => {
    const response = await fetch('/api/admin/products', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'published' }) });
    if (!response.ok) { setNotice('تعذر نشر المنتج في قاعدة البيانات.'); return; }
    setProducts((current) => current.map((product) => product.id === id ? { ...product, status: 'منشور' } : product));
    setNotice('تم نشر المنتج في العرض الحالي.');
  };

  const saveEdit = async (id, field, value) => {
    const response = await fetch('/api/admin/products', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, [field]: value }) });
    if (!response.ok) { setNotice('تعذر حفظ التعديل في قاعدة البيانات.'); return; }
    setProducts((current) => current.map((product) => product.id === id ? { ...product, [field]: value } : product));
    setEditingId(null);
    setNotice('تم حفظ التعديل في العرض الحالي.');
  };

  const logout = async () => {
    await fetch('/api/admin/session', { method: 'DELETE' });
    setLoggedIn(false);
  };

  if (checkingSession) return <main className="admin-page" dir="rtl"><div className="admin-login-card"><p className="admin-kicker">Kadel admin</p><h1>جارٍ التحقق من الجلسة</h1></div></main>;

  if (!loggedIn) {
    return <main className="admin-page" dir="rtl"><div className="admin-login-card"><div className="admin-logo"><LockKeyhole /></div><p className="admin-kicker">Kadel admin</p><h1>مرحبًا بك في Kadel admin</h1><p className="admin-muted">سجّل الدخول لإدارة المتاجر والأقسام والمنتجات.</p><form onSubmit={login} className="admin-form"><label>اسم المستخدم<input value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} placeholder="اسم المستخدم" autoComplete="username" /></label><label>كلمة المرور<input type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} placeholder="كلمة المرور" autoComplete="current-password" /></label><button className="admin-primary-button" type="submit"><LogIn /> دخول لوحة التحكم</button></form>{notice && <p className="admin-notice">{notice}</p>}</div></main>;
  }

  return <main className="admin-page" dir="rtl"><div className="admin-container"><header className="admin-header"><div><p className="admin-kicker">Kadel admin</p><h1>لوحة إدارة المتجر</h1><p className="admin-muted">اسحب المنتجات، صنّفها، ثم راجعها قبل ظهورها في المتجر.</p></div><button className="admin-outline-button" type="button" onClick={logout}>تسجيل الخروج</button></header>
    <section className="admin-stats"><div><span>المتاجر المدعومة</span><strong>{stores.length}</strong></div><div><span>المنتجات المعروضة</span><strong>{products.length}</strong></div><div><span>الفروع</span><strong>{categories.reduce((sum, item) => sum + item.branches.length, 0)}</strong></div></section>
    <section className="admin-panel"><div className="panel-heading"><div><h2><UploadCloud /> إضافة منتج من رابط العمولة</h2><p>ضع رابط العمولة، ثم راجع بيانات المنتج قبل إضافته إلى المتجر.</p></div><span className="safe-label">رابط عمولة خاص بك</span></div><form onSubmit={startScrape} className="scrape-grid"><label>المتجر<select value={store} onChange={(event) => setStore(event.target.value)}>{stores.map((item) => <option key={item}>{item}</option>)}</select></label><label>القسم<select value={category} onChange={(event) => changeCategory(event.target.value)}>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label>الفرع<select value={branch} onChange={(event) => setBranch(event.target.value)}>{(selectedCategory.branches.length ? selectedCategory.branches : ['بدون فرع']).map((item) => <option key={item}>{item}</option>)}</select></label><label className="url-field">رابط العمولة<input value={productUrl} onChange={(event) => setProductUrl(event.target.value)} placeholder="ألصق رابط العمولة هنا" type="url" dir="ltr" /></label><button className="admin-primary-button scrape-button" type="submit"><Link2 /> سحب البيانات من الرابط</button></form><div className="manual-product-fields"><label>اسم المنتج<input value={productDraft.title} onChange={(event) => setProductDraft({ ...productDraft, title: event.target.value })} placeholder="اكتب اسم المنتج" /></label><label>السعر<input value={productDraft.price} onChange={(event) => setProductDraft({ ...productDraft, price: event.target.value })} placeholder="مثال: 99.00 رس" /></label><label>صورة المنتج<input value={productDraft.image} onChange={(event) => setProductDraft({ ...productDraft, image: event.target.value })} placeholder="https://رابط-الصورة" type="url" dir="ltr" /></label><label className="description-field">وصف المنتج<input value={productDraft.description} onChange={(event) => setProductDraft({ ...productDraft, description: event.target.value })} placeholder="وصف مختصر اختياري" /></label><button className="admin-add-button" type="button" onClick={addProductToStore}><Plus /> إضافة إلى المتجر</button></div><p className="admin-helper">يمكنك سحب البيانات تلقائيًا أو تعبئة الحقول يدويًا، ثم مراجعتها قبل الإضافة.</p></section>
    <section className="admin-panel downloads-panel"><div className="panel-heading"><div><h2><Store /> تنزيلات المتجر</h2><p>كل منتج تم سحبه من رابط العمولة يظهر هنا كمسودة، ويمكنك تعديله أو نشره أو حذفه من المتجر نهائيًا.</p></div><div className="admin-search"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="بحث في التنزيلات" /></div></div><div className="product-table-wrap"><table className="product-table"><thead><tr><th>المنتج</th><th>المتجر</th><th>القسم والفرع</th><th>السعر</th><th>الحالة</th><th>إجراءات</th></tr></thead><tbody>{filteredProducts.length === 0 ? <tr><td colSpan="6" className="empty-products">لا توجد منتجات محفوظة بعد. أضف منتجًا من نموذج رابط العمولة أعلاه.</td></tr> : filteredProducts.map((product) => <tr key={product.id}><td><div className="product-name-cell"><div className="product-thumb">{product.image ? <img src={product.image} alt="" /> : <span>صورة</span>}</div>{editingId === product.id ? <input className="inline-edit" defaultValue={product.title} onBlur={(event) => saveEdit(product.id, 'title', event.target.value)} autoFocus /> : <strong>{product.title}</strong>}</div></td><td>{product.store}</td><td><span>{product.category}</span><small>{product.branch}</small></td><td>{editingId === product.id ? <input className="inline-edit price-edit" defaultValue={product.price} onBlur={(event) => saveEdit(product.id, 'price', event.target.value)} /> : product.price || 'غير محدد'}</td><td><span className={`status-badge ${product.status === 'منشور' ? 'published-badge' : ''}`}>{product.status}</span></td><td><div className="row-actions"><button type="button" className="publish-row-button" title="نشر في المتجر" onClick={() => publishProduct(product.id)}><UploadCloud /></button><button type="button" title="تعديل" onClick={() => setEditingId(product.id)}><Edit3 /></button><button type="button" title="حفظ" onClick={() => setEditingId(null)}><Save /></button><button type="button" className="delete-store-button" title="حذف من المتجر" onClick={() => deleteProduct(product.id)}><Trash2 /><span>حذف من المتجر</span></button>{product.image && <a href={product.image} target="_blank" rel="noreferrer" title="فتح الصورة"><ExternalLink /></a>}</div></td></tr>)}</tbody></table></div></section>
    {notice && <p className="admin-notice">{notice}</p>}
  </div></main>;
}

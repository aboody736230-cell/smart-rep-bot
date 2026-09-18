'use client';

import { useMemo, useState } from 'react';
import { Edit3, ExternalLink, Filter, Link2, LockKeyhole, LogIn, Plus, Save, Search, Store, Trash2, UploadCloud } from 'lucide-react';

const stores = ['SHEIN', 'Amazon', 'Temu', 'AliExpress', 'نون', 'نمشي', 'ترينديول'];
const categories = [
  { name: 'الأحذية', branches: ['أحذية رياضية', 'أحذية مشي', 'أحذية كعب', 'أحذية كاجوال'] },
  { name: 'الملابس', branches: ['فساتين', 'بلوزات', 'فساتين سهرات', 'جينزات', 'ملابس داخلية', 'سراويل'] },
  { name: 'الشنط', branches: ['شنط كتف', 'شنط سهرات', 'شنط يد'] },
  { name: 'العناية والجمال', branches: ['مكياج وتجميل', 'العناية بالشعر', 'العناية بالبشرة'] },
  { name: 'العطور', branches: [] },
];

const initialProducts = [
  { id: 1, title: 'منتج تجريبي — سيظهر هنا بعد السحب', store: 'SHEIN', category: 'الأحذية', branch: 'أحذية رياضية', price: '—', status: 'مسودة', image: '' },
];

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [store, setStore] = useState(stores[0]);
  const [category, setCategory] = useState(categories[0].name);
  const [branch, setBranch] = useState(categories[0].branches[0]);
  const [productUrl, setProductUrl] = useState('');
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [editingId, setEditingId] = useState(null);

  const selectedCategory = categories.find((item) => item.name === category) || categories[0];
  const filteredProducts = useMemo(() => products.filter((product) => [product.title, product.store, product.category, product.branch].join(' ').toLowerCase().includes(search.toLowerCase())), [products, search]);

  const login = (event) => {
    event.preventDefault();
    if (!credentials.username || !credentials.password) {
      setNotice('اكتب اسم المستخدم وكلمة المرور للمتابعة.');
      return;
    }
    setLoggedIn(true);
    setNotice('تم فتح لوحة التحكم لهذه الجلسة. اربط التحقق الحقيقي من السيرفر قبل النشر النهائي.');
  };

  const changeCategory = (value) => {
    const next = categories.find((item) => item.name === value) || categories[0];
    setCategory(next.name);
    setBranch(next.branches[0] || 'بدون فرع');
  };

  const startScrape = (event) => {
    event.preventDefault();
    if (!productUrl.trim()) {
      setNotice('ألصق رابط المنتج أولًا.');
      return;
    }
    setNotice(`تم تجهيز الرابط للسحب من ${store}. محرك السحب الحقيقي يحتاج ربط API/موصل المتجر في الخطوة التالية.`);
    setProductUrl('');
  };

  const deleteProduct = (id) => {
    setProducts((current) => current.filter((product) => product.id !== id));
    setNotice('تم حذف المنتج من قائمة العرض الحالية.');
  };

  const saveEdit = (id, field, value) => {
    setProducts((current) => current.map((product) => product.id === id ? { ...product, [field]: value } : product));
    setEditingId(null);
    setNotice('تم حفظ التعديل في العرض الحالي.');
  };

  if (!loggedIn) {
    return <main className="admin-page" dir="rtl"><div className="admin-login-card"><div className="admin-logo"><LockKeyhole /></div><p className="admin-kicker">Kadel admin</p><h1>مرحبًا بك في Kadel admin</h1><p className="admin-muted">سجّل الدخول لإدارة المتاجر والأقسام والمنتجات.</p><form onSubmit={login} className="admin-form"><label>اسم المستخدم<input value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} placeholder="اسم المستخدم" autoComplete="username" /></label><label>كلمة المرور<input type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} placeholder="كلمة المرور" autoComplete="current-password" /></label><button className="admin-primary-button" type="submit"><LogIn /> دخول لوحة التحكم</button></form>{notice && <p className="admin-notice">{notice}</p>}</div></main>;
  }

  return <main className="admin-page" dir="rtl"><div className="admin-container"><header className="admin-header"><div><p className="admin-kicker">Kadel admin</p><h1>لوحة إدارة المتجر</h1><p className="admin-muted">اسحب المنتجات، صنّفها، ثم راجعها قبل ظهورها في المتجر.</p></div><button className="admin-outline-button" type="button" onClick={() => setLoggedIn(false)}>تسجيل الخروج</button></header>
    <section className="admin-stats"><div><span>المتاجر المدعومة</span><strong>{stores.length}</strong></div><div><span>المنتجات المعروضة</span><strong>{products.length}</strong></div><div><span>الفروع</span><strong>{categories.reduce((sum, item) => sum + item.branches.length, 0)}</strong></div></section>
    <section className="admin-panel"><div className="panel-heading"><div><h2><UploadCloud /> سحب منتج جديد</h2><p>اختر مصدر الرابط والقسم والفرع قبل حفظ المنتج.</p></div><span className="safe-label">سحب من جهة السيرفر</span></div><form onSubmit={startScrape} className="scrape-grid"><label>المتجر<select value={store} onChange={(event) => setStore(event.target.value)}>{stores.map((item) => <option key={item}>{item}</option>)}</select></label><label>القسم<select value={category} onChange={(event) => changeCategory(event.target.value)}>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label>الفرع<select value={branch} onChange={(event) => setBranch(event.target.value)}>{(selectedCategory.branches.length ? selectedCategory.branches : ['بدون فرع']).map((item) => <option key={item}>{item}</option>)}</select></label><label className="url-field">رابط المنتج<input value={productUrl} onChange={(event) => setProductUrl(event.target.value)} placeholder="https://..." type="url" dir="ltr" /></label><button className="admin-primary-button scrape-button" type="submit"><Link2 /> بدء السحب</button></form><p className="admin-helper">سيتم استخراج الاسم والصور والسعر والوصف عند ربط موصل المتجر المناسب.</p></section>
    <section className="admin-panel"><div className="panel-heading"><div><h2><Store /> المنتجات الحالية</h2><p>راجع المنتجات وعدّل بياناتها أو احذفها قبل النشر.</p></div><div className="admin-search"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="بحث في المنتجات" /></div></div><div className="product-table-wrap"><table className="product-table"><thead><tr><th>المنتج</th><th>المتجر</th><th>القسم والفرع</th><th>السعر</th><th>الحالة</th><th>إجراءات</th></tr></thead><tbody>{filteredProducts.map((product) => <tr key={product.id}><td><div className="product-name-cell"><div className="product-thumb">{product.image ? <img src={product.image} alt="" /> : <span>صورة</span>}</div>{editingId === product.id ? <input className="inline-edit" defaultValue={product.title} onBlur={(event) => saveEdit(product.id, 'title', event.target.value)} autoFocus /> : <strong>{product.title}</strong>}</div></td><td>{product.store}</td><td><span>{product.category}</span><small>{product.branch}</small></td><td>{editingId === product.id ? <input className="inline-edit price-edit" defaultValue={product.price} onBlur={(event) => saveEdit(product.id, 'price', event.target.value)} /> : product.price}</td><td><span className="status-badge">{product.status}</span></td><td><div className="row-actions"><button type="button" title="تعديل" onClick={() => setEditingId(product.id)}><Edit3 /></button><button type="button" title="حفظ" onClick={() => setEditingId(null)}><Save /></button><button type="button" title="حذف" onClick={() => deleteProduct(product.id)}><Trash2 /></button>{product.image && <a href={product.image} target="_blank" rel="noreferrer" title="فتح الصورة"><ExternalLink /></a>}</div></td></tr>)}</tbody></table></div></section>
    {notice && <p className="admin-notice">{notice}</p>}
  </div></main>;
}

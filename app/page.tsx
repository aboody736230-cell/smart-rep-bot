'use client';

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ClipboardPaste,
  ExternalLink,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  Package,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Store,
  Tag,
  TrendingUp,
  XCircle,
} from "lucide-react";

type ProductData = {
  title: string;
  price: string | null;
  currency: string | null;
  description: string | null;
  image: string | null;
  brand: string | null;
  sku: string | null;
  availability: string | null;
  rating: string | null;
  reviewCount: string | null;
  sourceUrl: string;
  storeName: string;
  rawPrice: number | null;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeProduct(event: FormEvent) {
    event.preventDefault();

    setError("");
    setProduct(null);

    if (!url.trim()) {
      setError("يرجى لصق رابط المنتج أولًا");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/products/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "تعذر تحليل الرابط");
      }

      setProduct(data.product);
    } catch (err: any) {
      setError(err?.message || "حدث خطأ أثناء تحليل المنتج");
    } finally {
      setLoading(false);
    }
  }

  function clearResult() {
    setProduct(null);
    setError("");
    setUrl("");
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f7f8fa] text-[#17202a]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[250px] shrink-0 border-l border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#155e63] text-white">
              <Store size={21} />
            </div>

            <div>
              <h1 className="text-lg font-black text-[#155e63]">كادل</h1>
              <p className="text-[11px] text-slate-400">
                لوحة تحكم المتجر
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            <SidebarItem
              icon={<LayoutDashboard size={18} />}
              text="نظرة عامة"
              active
            />
            <SidebarItem
              icon={<Sparkles size={18} />}
              text="المحلل الذكي"
            />
            <SidebarItem
              icon={<Package size={18} />}
              text="المنتجات"
            />
            <SidebarItem
              icon={<BarChart3 size={18} />}
              text="التقارير"
            />
            <SidebarItem
              icon={<Settings size={18} />}
              text="الإعدادات"
            />
          </nav>

          <div className="m-4 rounded-2xl bg-[#f0f8f7] p-4">
            <div className="mb-2 flex items-center gap-2 text-[#155e63]">
              <Sparkles size={16} />
              <span className="text-sm font-bold">مساعد كادل</span>
            </div>

            <p className="text-xs leading-6 text-slate-500">
              الصق رابط المنتج وسيقوم النظام بقراءة بياناته تلقائيًا.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
            <div>
              <p className="text-xs font-medium text-slate-400">
                لوحة التحكم / الرئيسية
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-800">
                صباح الخير، مدير المتجر
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-left sm:block">
                <p className="text-sm font-bold text-slate-700">
                  متجر كادل
                </p>
                <p className="text-xs text-slate-400">
                  الحساب الرئيسي
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9eeeb] font-black text-[#155e63]">
                ك
              </div>
            </div>
          </header>

          <section className="mx-auto max-w-7xl p-5 sm:p-8">
            <div className="mb-8 grid gap-5 md:grid-cols-3">
              <StatCard
                icon={<Package size={20} />}
                label="إجمالي المنتجات"
                value="128"
                change="+12 هذا الشهر"
              />
              <StatCard
                icon={<TrendingUp size={20} />}
                label="المنتجات النشطة"
                value="96"
                change="+8.4%"
              />
              <StatCard
                icon={<Search size={20} />}
                label="تحليلات المنتجات"
                value="34"
                change="هذا الأسبوع"
              />
            </div>

            <div className="mb-8 rounded-[28px] bg-[#155e63] p-6 text-white shadow-xl shadow-[#155e63]/10 sm:p-9">
              <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#bde5df]">
                    <Sparkles size={14} />
                    أداة كادل الذكية
                  </div>

                  <h3 className="text-2xl font-black sm:text-3xl">
                    أضف منتجًا في ثوانٍ
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-[#d5eeeb]">
                    الصق رابط المنتج من أي متجر إلكتروني، وسنستخرج لك الاسم
                    والسعر والصورة والوصف والمعلومات الأساسية تلقائيًا.
                  </p>
                </div>

                <div className="hidden h-16 w-16 items-center justify-center rounded-3xl bg-white/10 md:flex">
                  <Sparkles size={30} className="text-[#bde5df]" />
                </div>
              </div>

              <form onSubmit={analyzeProduct}>
                <div className="flex flex-col gap-3 rounded-2xl bg-white p-2 shadow-lg sm:flex-row">
                  <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                    <Search className="shrink-0 text-slate-400" size={20} />

                    <input
                      value={url}
                      onChange={(event) => setUrl(event.target.value)}
                      placeholder="https://example.com/product..."
                      className="h-12 min-w-0 flex-1 bg-transparent text-left text-sm text-slate-800 outline-none placeholder:text-slate-400"
                      dir="ltr"
                    />

                    {url && (
                      <button
                        type="button"
                        onClick={() => setUrl("")}
                        className="text-slate-400 hover:text-slate-700"
                        aria-label="مسح الرابط"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#efaa54] px-6 text-sm font-black text-[#422b13] transition hover:bg-[#f6b969] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        جاري التحليل
                      </>
                    ) : (
                      <>
                        تحليل المنتج
                        <ArrowLeft size={17} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4 flex items-center gap-2 text-xs text-[#c4e3df]">
                <CheckCircle2 size={15} />
                لا نحتاج إلى تسجيل دخول للمتجر الذي يأتي منه الرابط
              </div>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <XCircle className="mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="font-bold">تعذر تحليل الرابط</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            )}

            {product ? (
              <ProductResult
                product={product}
                onClear={clearResult}
              />
            ) : (
              <EmptyState />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  text,
  active = false,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
        active
          ? "bg-[#e9f5f3] text-[#155e63]"
          : "text-slate-500 hover:bg-slate-50 hover:text-[#155e63]"
      }`}
    >
      {icon}
      {text}
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9f5f3] text-[#155e63]">
          {icon}
        </div>

        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
          {change}
        </span>
      </div>

      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-800">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#eef7f5] text-[#155e63]">
        <ClipboardPaste size={28} />
      </div>

      <h3 className="text-lg font-black text-slate-800">
        ابدأ بتحليل أول منتج
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-400">
        انسخ رابط أي منتج من متجرك أو من متجر آخر، ثم الصقه في الحقل أعلاه
        للحصول على البيانات الأساسية.
      </p>
    </div>
  );
}

function ProductResult({
  product,
  onClear,
}: {
  product: ProductData;
  onClear: () => void;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold text-[#155e63]">نتيجة التحليل</p>
          <h3 className="mt-1 text-xl font-black text-slate-800">
            بيانات المنتج المستخرجة
          </h3>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-[#155e63] hover:text-[#155e63]"
        >
          <RefreshCw size={16} />
          تحليل رابط آخر
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="flex aspect-square items-center justify-center bg-slate-50">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-contain p-4"
              />
            ) : (
              <ImageIcon size={48} className="text-slate-300" />
            )}
          </div>

          <div className="p-5">
            <p className="mb-2 text-xs text-slate-400">المصدر</p>

            <a
              href={product.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-[#155e63] hover:underline"
              dir="ltr"
            >
              {product.storeName}
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-7 flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#e9f5f3] px-3 py-1 text-xs font-bold text-[#155e63]">
                  تم التحليل بنجاح
                </span>

                {product.brand && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                    {product.brand}
                  </span>
                )}
              </div>

              <h4 className="max-w-2xl text-xl font-black leading-9 text-slate-800">
                {product.title}
              </h4>
            </div>

            <div className="shrink-0">
              <p className="text-xs text-slate-400">السعر</p>
              <p className="mt-1 text-2xl font-black text-[#155e63]">
                {product.price || "غير متوفر"}
                {product.currency && (
                  <span className="mr-2 text-sm font-bold text-slate-400">
                    {product.currency}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem
              icon={<Tag size={17} />}
              label="رقم المنتج"
              value={product.sku || "غير متوفر"}
            />

            <InfoItem
              icon={<Package size={17} />}
              label="حالة المخزون"
              value={formatAvailability(product.availability)}
            />

            <InfoItem
              icon={<Sparkles size={17} />}
              label="التقييم"
              value={
                product.rating
                  ? `${product.rating} / 5`
                  : "غير متوفر"
              }
            />

            <InfoItem
              icon={<BarChart3 size={17} />}
              label="عدد المراجعات"
              value={product.reviewCount || "غير متوفر"}
            />
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="mb-2 text-sm font-black text-slate-700">
              وصف المنتج
            </p>

            <p className="text-sm leading-8 text-slate-500">
              {product.description || "لم يتم العثور على وصف لهذا المنتج."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef7f5] text-[#155e63]">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-1 text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function formatAvailability(value: string | null) {
  if (!value) return "غير متوفر";

  if (value.toLowerCase().includes("instock")) {
    return "متوفر";
  }

  if (
    value.toLowerCase().includes("outofstock") ||
    value.toLowerCase().includes("soldout")
  ) {
    return "غير متوفر";
  }

  return value.split("/").pop() || value;
}

'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleScrape = async () => {
    setLoading(true);
    setMessage('جاري تشغيل أداة الشفط وجلب المنتجات...');
    try {
      // يمكنك ربط رابط مسار الـ API الخاص بالشفط هنا مستقبلاً
      setTimeout(() => {
        setLoading(false);
        setMessage('تمت عملية الشفط وتحديث المنتجات بنجاح!');
      }, 2000);
    } catch (error) {
      setLoading(false);
      setMessage('حدث خطأ أثناء عملية الشفط.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">لوحة تحكم متجر KADEL 🛍️</h1>
        
        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <h3 className="text-gray-400 text-sm">إجمالي المنتجات</h3>
            <p className="text-2xl font-bold mt-2">128</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <h3 className="text-gray-400 text-sm">حالة أداة الشفط</h3>
            <p className="text-2xl font-bold mt-2 text-green-400">جاهز للعمل</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <h3 className="text-gray-400 text-sm">آخر تحديث</h3>
            <p className="text-2xl font-bold mt-2">اليوم</p>
          </div>
        </div>

        {/* قسم أداة الشفط */}
        <div className="bg-gray-800 p-6 rounded-lg shadow mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">أداة شفط البيانات</h2>
          <button 
            onClick={handleScrape}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'جاري الشفط...' : 'بدء عملية الشفط الآن 🔄'}
          </button>
          {message && <p className="mt-4 text-sm text-yellow-400">{message}</p>}
        </div>

        {/* جدول المنتجات */}
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">المنتجات الحالية</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="pb-3">اسم المنتج</th>
                  <th className="pb-3">السعر</th>
                  <th className="pb-3">الحالة</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700/50">
                  <td className="py-3">منتج تجريبي 1</td>
                  <td className="py-3">$45.00</td>
                  <td className="py-3 text-green-400">نشط</td>
                </tr>
                <tr>
                  <td className="py-3">منتج تجريبي 2</td>
                  <td className="py-3">$89.00</td>
                  <td className="py-3 text-green-400">نشط</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

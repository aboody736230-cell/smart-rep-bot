import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-950 text-white font-sans">
        {children}
      </body>
    </html>
  );
}

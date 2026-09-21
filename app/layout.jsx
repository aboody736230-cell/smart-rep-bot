import './globals.css';

export const metadata = {
  metadataBase: new URL('https://kadel.online'),
  title: { default: 'Kadel | كادل للأناقة والموضة', template: '%s | Kadel' },
  description: 'كادل متجر إلكتروني للأزياء النسائية والرجالية، الأحذية، الشنط، العطور، العناية والجمال ومنتجات الأطفال من أشهر المتاجر العالمية.',
  keywords: ['كادل', 'Kadel', 'متجر كادل', 'متجر إلكتروني', 'ملابس نسائية', 'أحذية', 'شنط', 'عطور', 'عناية وجمال', 'ملابس أطفال', 'SHEIN', 'Amazon', 'Temu'],
  applicationName: 'Kadel Boutique',
  category: 'shopping',
  alternates: { canonical: 'https://kadel.online/' },
  icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }], shortcut: ['/icon.svg'], apple: [{ url: '/icon.svg', type: 'image/svg+xml' }] },
  openGraph: { type: 'website', locale: 'ar_SA', url: 'https://kadel.online/', siteName: 'Kadel Boutique', title: 'Kadel | كادل للأناقة والموضة', description: 'تسوّق الأزياء والأحذية والشنط والعطور والعناية والجمال ومنتجات الأطفال من أشهر المتاجر العالمية في متجر واحد.' },
  twitter: { card: 'summary', title: 'Kadel | كادل للأناقة والموضة', description: 'متجر كادل الإلكتروني للأزياء والمنتجات العالمية.' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: 'Kadel Boutique | متجر كادل',
  alternateName: 'كادل',
  url: 'https://kadel.online/',
  logo: 'https://kadel.online/icon.svg',
  description: 'متجر كادل الإلكتروني للأزياء والأحذية والشنط والعطور والعناية والجمال ومنتجات الأطفال.',
  inLanguage: 'ar',
  sameAs: [],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-950 text-white font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
      </body>
    </html>
  );
}

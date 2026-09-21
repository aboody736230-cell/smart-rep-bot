export default function manifest() {
  return {
    name: 'Kadel Boutique | متجر كادل',
    short_name: 'Kadel',
    description: 'متجر كادل الإلكتروني للأزياء والمنتجات العالمية.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f3e6d2',
    theme_color: '#f3e6d2',
    lang: 'ar',
    dir: 'rtl',
    icons: [
      { src: '/favicon.ico', sizes: '256x256', type: 'image/x-icon', purpose: 'any maskable' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
    ],
  };
}

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://kadel.online/sitemap.xml',
    host: 'https://kadel.online',
  };
}

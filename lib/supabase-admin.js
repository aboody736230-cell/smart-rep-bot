const tableUrl = () => `${process.env.SUPABASE_URL}/rest/v1/products`;

export function supabaseHeaders() {
  return { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' };
}

export async function supabaseRequest(path = '', options = {}) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Supabase environment variables are missing');
  return fetch(`${tableUrl()}${path}`, { ...options, headers: { ...supabaseHeaders(), ...(options.headers || {}) }, cache: 'no-store' });
}

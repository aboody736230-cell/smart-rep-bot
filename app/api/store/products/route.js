import { NextResponse } from 'next/server';
import { supabaseRequest } from '../../../../lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const response = await supabaseRequest('?select=id,name,price,image_url,description,affiliate_url,store,category,branch,status&status=eq.published&order=created_at.desc&limit=100');
  if (!response.ok) return NextResponse.json({ products: [] }, { status: 200 });
  const rows = await response.json();
  return NextResponse.json({ products: rows.map((row) => ({ id: row.id, title: row.name, price: row.price ? `${row.price} رس` : '', image: row.image_url || '', description: row.description || '', url: row.affiliate_url || '', store: row.store || '', category: row.category || '', branch: row.branch || '' })) });
}

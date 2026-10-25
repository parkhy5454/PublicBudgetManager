import { NextResponse } from 'next/server';
import { validateItems } from '@/lib/validationRules';

export async function POST(req: Request) {
  const { items } = await req.json();
  const results = validateItems(items);
  return NextResponse.json({ results, count: results.length });
}
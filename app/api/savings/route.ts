import { NextResponse } from 'next/server';
import { calcTotalSavings } from '@/lib/savings';

export async function POST(req: Request) {
  const { items } = await req.json();
  const result = calcTotalSavings(items);
  return NextResponse.json(result);
}
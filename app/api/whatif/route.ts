import { NextResponse } from 'next/server';
import { simulateCut } from '@/lib/whatif';

export async function POST(req: Request) {
  const { items, scenario } = await req.json();
  const result = simulateCut(items, scenario);
  return NextResponse.json(result);
}
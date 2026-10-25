import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  const { items } = await req.json();
  // 인상률: 행안부 노임 3.2% 기본
  const RISE_RATE = 0.032;
  const baseline = items.map((it:any) => ({
    ...it,
    base_amount: Math.round(it.prev_amount * (1 + RISE_RATE)),
    final_amount: Math.round(it.prev_amount * (1 + RISE_RATE)),
    status: 'keep'
  }));
  return NextResponse.json({ baseline, rise_rate: RISE_RATE });
}
import { NextResponse } from 'next/server';
import { simulateAllReviewers } from '@/lib/auditor';

export async function POST(req: Request) {
  const { items } = await req.json();
  const results = simulateAllReviewers(items);
  return NextResponse.json({ results });
}
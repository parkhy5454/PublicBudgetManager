import { NextResponse } from 'next/server';
import { matchGuidelines, generateDefenseLogic } from '@/lib/guideline';

export async function POST(req: Request) {
  const { items } = await req.json();
  const results = items.map((it:any) => {
    const matches = matchGuidelines(it);
    const defense = matches.length ? generateDefenseLogic(it, matches) : null;
    return { id: it.id, project_name: it.project_name, matches, defense };
  });
  return NextResponse.json({ results });
}
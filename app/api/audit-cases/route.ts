import { NextResponse } from 'next/server';
import { searchAuditCases, AUDIT_DB } from '@/lib/auditRAG';

export async function POST(req: Request) {
  const { items } = await req.json();
  const results = items.map((it:any)=>({ id: it.id, project_name: it.project_name, cases: searchAuditCases(it) }));
  return NextResponse.json({ results, totalCases: AUDIT_DB.length });
}
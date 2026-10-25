import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  const rows = await sql`SELECT dept, COUNT(*) as total, COUNT(*) FILTER (WHERE status IN ('submitted','approved','final')) as submitted FROM budget_items GROUP BY dept`;
  return NextResponse.json({ status: rows });
}
export async function POST(req: Request) {
  const { dept, user_id } = await req.json();
  await sql`UPDATE budget_items SET status='submitted' WHERE dept=${dept}`;
  await sql`INSERT INTO audit_logs (user_id, action, table_name, reason) VALUES (${user_id}, 'submit', 'budget_items', ${dept + ' 제출'})`;
  return NextResponse.json({ ok:true });
}
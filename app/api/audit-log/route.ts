import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  const { user_id, action, table_name, record_id, ip, reason } = await req.json();
  await sql`INSERT INTO audit_logs (user_id, action, table_name, record_id, ip, reason)
            VALUES (${user_id}, ${action}, ${table_name}, ${record_id}, ${ip}, ${reason})`;
  return NextResponse.json({ ok:true });
}
export async function GET() {
  const logs = await sql`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100`;
  return NextResponse.json({ logs });
}
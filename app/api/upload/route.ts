import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.json();
  // body: { items: [], user_id, dept }
  const { items, user_id, dept, change_reason } = body;

  // 개인정보 체크
  for (const it of items) {
    if (/\d{6}-\d{7}/.test(JSON.stringify(it))) {
      return NextResponse.json({ error: '개인정보 포함' }, { status: 400 });
    }
  }

  const inserted = [];
  for (const it of items) {
    const res = await sql`INSERT INTO budget_items 
      (org_id, year, dept, project_name, account_code, account_name, prev_amount, base_amount, final_amount, execution_rate, calc_basis, type)
      VALUES (${it.org_id||'demo'}, ${it.year||2024}, ${dept}, ${it.project_name}, ${it.account_code}, ${it.account_name}, ${it.prev_amount}, ${it.base_amount}, ${it.final_amount}, ${it.execution_rate}, ${it.calc_basis}, ${it.type||'existing'})
      RETURNING id`;
    inserted.push(res[0]);

    // history 저장
    await sql`INSERT INTO budget_items_history (budget_id, user_id, new_data, change_reason)
              VALUES (${res[0].id}, ${user_id}, ${JSON.stringify(it)}, ${change_reason||'initial upload'})`;
  }

  // audit log
  await sql`INSERT INTO audit_logs (user_id, action, table_name, ip, reason)
            VALUES (${user_id}, 'upload', 'budget_items', ${req.headers.get('x-forwarded-for')||''}, ${change_reason||'bulk upload'})`;

  return NextResponse.json({ ok:true, count: inserted.length, ids: inserted });
}
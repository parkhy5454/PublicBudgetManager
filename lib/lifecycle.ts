export type Asset = { name:string, purchaseYear:number, lifeYears:number, price:number, dept:string };

export function checkLifecycle(asset: Asset, currentYear: number) {
  const age = currentYear - asset.purchaseYear;
  const remaining = asset.lifeYears - age;
  let status: '정상'|'교체적기'|'연장사용'|'교체지연' = '정상';
  let message = '';
  if (remaining === 0) { status='교체적기'; message=`내구연한 ${asset.lifeYears}년 도과, 교체 적기. 미교체 시 수리비 연 20% 증가 예상`; }
  else if (remaining < 0) { status='교체지연'; message=`내구연한 ${Math.abs(remaining)}년 초과, 고장 위험 높음, 교체 시급`; }
  else if (remaining <=1) { status='연장사용'; message=`내구연한 1년 남음, 내년 예산 반영 필요`; }
  else { message=`잔여 ${remaining}년, 정상 사용`; }
  return { ...asset, age, remaining, status, message };
}

export function recommendJointPurchase(items: any[]) {
  const groups: Record<string, any[]> = {};
  for (const it of items) {
    if (it.type==='purchase') {
      const key = it.project_name.split(' ')[0]; // 노트북, 복사기
      if (!groups[key]) groups[key]=[];
      groups[key].push(it);
    }
  }
  const recs = [];
  for (const [k,v] of Object.entries(groups)) {
    if (v.length>1 || (v[0].qty && v[0].qty>=10)) {
      const total = v.reduce((s,i)=>s+i.final_amount,0);
      const saving = Math.round(total*0.15);
      recs.push({ item: k, count: v.reduce((s,i)=>s+(i.qty||0),0), total, saving, message: `${k} ${v.reduce((s,i)=>s+(i.qty||0),0)}개 공동구매 시 15% 할인, ${saving.toLocaleString()}원 절감` });
    }
  }
  return recs;
}
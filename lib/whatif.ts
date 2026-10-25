export type WhatIfScenario = {
  cutPercent: number,
  targetDepts?: string[],
  protectTypes?: string[]
}

export type WhatIfResult = {
  original: number,
  cut: number,
  adjusted: number,
  cuts: { id:number, project_name:string, dept:string, cutAmount:number, impact:'low'|'medium'|'high', reason:string }[]
}

export function simulateCut(items: any[], scenario: WhatIfScenario): WhatIfResult {
  const original = items.reduce((s,i)=>s+i.final_amount,0);
  const cutAmount = Math.round(original * scenario.cutPercent / 100);

  // 우선순위: 집행률 낮음 > 단가 높음 > 중복 > 신규
  const scored = items.map(it => {
    let score = 0;
    let impact: 'low'|'medium'|'high' = 'medium';
    let reason = '';
    if (it.execution_rate < 60) { score += 100; impact='low'; reason=`집행률 ${it.execution_rate}% 저조`; }
    else if (it.execution_rate < 80) { score += 60; impact='low'; reason=`집행률 ${it.execution_rate}%`; }
    if (it.duplicate) { score += 50; reason+= (reason?', ':'') + '중복'; }
    if (it.unit_price && it.avg_market_price && it.unit_price > it.avg_market_price) { score += 40; impact='low'; reason+= (reason?', ':'') + `단가 ${Math.round((it.unit_price/it.avg_market_price-1)*100)}% 높음`; }
    if (it.type === 'new_project') { score += 30; impact='medium'; reason+= (reason?', ':'') + '신규사업'; }
    if (it.type === 'purchase') { score += 20; impact='low'; reason+= (reason?', ':'') + '구매 연기 가능'; }
    if (!reason) { reason='사업 필수 유지'; impact='high'; }
    return { ...it, _score: score, _impact: impact, _reason: reason };
  }).sort((a,b)=>b._score - a._score);

  let remaining = cutAmount;
  const cuts: WhatIfResult['cuts'] = [];
  for (const it of scored) {
    if (remaining <= 0) break;
    if (scenario.targetDepts && !scenario.targetDepts.includes(it.dept)) continue;
    if (scenario.protectTypes && scenario.protectTypes.includes(it.type)) continue;
    if (it._impact === 'high' && scenario.cutPercent < 20) continue; // 20% 미만 삭감 시 필수사업 보호

    const cut = Math.min(remaining, Math.round(it.final_amount * 0.5)); // 최대 50%까지만
    if (cut > 0) {
      cuts.push({ id: it.id, project_name: it.project_name, dept: it.dept, cutAmount: cut, impact: it._impact, reason: it._reason });
      remaining -= cut;
    }
  }

  return { original, cut: cutAmount - remaining, adjusted: original - (cutAmount - remaining), cuts };
}
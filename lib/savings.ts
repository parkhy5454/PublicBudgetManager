export type SavingResult = {
  original: number,
  executionSaving: number,
  marketSaving: number,
  duplicateSaving: number,
  totalSaving: number,
  adjusted: number,
  savingRate: number,
  reasons: string[]
}

export function calcSavings(item: any): SavingResult {
  const reasons: string[] = [];
  let execSaving = 0, marketSaving = 0, dupSaving = 0;

  // 1. 집행률 기반 절감
  if (item.execution_rate && item.execution_rate < 80) {
    execSaving = Math.round(item.prev_amount * (1 - item.execution_rate/100) * 0.8); // 80%만 절감으로 인정
    if (execSaving > 0) reasons.push(`집행률 ${item.execution_rate}% 기반 불용 예상 ${execSaving.toLocaleString()}원`);
  }

  // 2. 나라장터 단가 기반 절감
  if (item.avg_market_price && item.unit_price && item.qty) {
    if (item.unit_price > item.avg_market_price) {
      marketSaving = (item.unit_price - item.avg_market_price) * item.qty;
      reasons.push(`나라장터 평균 ${item.avg_market_price.toLocaleString()}원 대비 ${(item.unit_price - item.avg_market_price).toLocaleString()}원 높음`);
    }
  } else if (item.prev_amount && item.avg_market_price) {
    // 기존 사업도 평균가 비교 (간접)
  }

  // 3. 중복 기반 (mock: 유사사업 있을 경우 30% 절감)
  if (item.duplicate) {
    dupSaving = Math.round(item.prev_amount * 0.3);
    reasons.push(`유사사업 중복으로 통합 시 30% 절감`);
  }

  const totalSaving = execSaving + marketSaving + dupSaving;
  const adjusted = Math.max(0, item.final_amount - totalSaving);
  const savingRate = item.final_amount > 0 ? (totalSaving / item.final_amount) * 100 : 0;

  return { original: item.final_amount, executionSaving: execSaving, marketSaving, duplicateSaving: dupSaving, totalSaving, adjusted, savingRate, reasons };
}

export function calcTotalSavings(items: any[]) {
  const details = items.map(calcSavings);
  const totalOriginal = details.reduce((s,d)=>s+d.original,0);
  const totalSaving = details.reduce((s,d)=>s+d.totalSaving,0);
  const totalAdjusted = totalOriginal - totalSaving;
  return { totalOriginal, totalSaving, totalAdjusted, savingRate: totalOriginal ? totalSaving/totalOriginal*100 : 0, details };
}
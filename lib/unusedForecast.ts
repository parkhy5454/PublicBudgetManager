export type Forecast = { month: number, expectedExecution: number, expectedUnused: number, alert?: string };

export function forecastUnused(item: any): Forecast[] {
  const forecasts: Forecast[] = [];
  const total = item.final_amount;
  // 작년 집행 패턴 mock: 1~6월 20%, 7~10월 40%, 11~12월 40% 집중
  const pattern = [0.02,0.03,0.05,0.05,0.05,0.10,0.10,0.10,0.10,0.10,0.15,0.15];
  let cumulative = 0;
  for (let m=0; m<12; m++) {
    const expected = total * pattern[m] * (item.execution_rate/100);
    cumulative += expected;
    const unused = total - cumulative;
    let alert;
    if (m===10 && unused > total*0.3) alert = `11월 예상 불용 ${unused.toLocaleString()}원 (${Math.round(unused/total*100)}%), 재배정 필요`;
    if (m===11 && unused > total*0.1) alert = `연말 불용 ${unused.toLocaleString()}원 예상, 경영평가 감점 위험`;
    forecasts.push({ month: m+1, expectedExecution: Math.round(cumulative), expectedUnused: Math.round(unused), alert });
  }
  return forecasts;
}

export function getYearEndRisk(items: any[]) {
  let totalUnused = 0;
  for (const it of items) {
    const f = forecastUnused(it);
    totalUnused += f[11].expectedUnused;
  }
  const total = items.reduce((s,i)=>s+i.final_amount,0);
  const rate = total ? totalUnused/total*100 : 0;
  return { totalUnused, rate, risk: rate>10 ? 'high' : rate>5 ? 'medium' : 'low', message: rate>10 ? `연말 불용률 ${rate.toFixed(1)}% 예상, 경영평가 감점 2점 위험` : `불용률 ${rate.toFixed(1)}% 양호` };
}
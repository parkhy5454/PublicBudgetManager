export type AuditCase = { id:string, year:number, org:string, title:string, category:string, content:string, relatedAccount?:string, penalty:string };

export const AUDIT_DB: AuditCase[] = [
  { id:'A_2023_001', year:2023, org:'A공단', title:'사무관리비→복리후생비 오분류', category:'계정과목', content:'복지 관련 사업을 사무관리비로 편성, 감사 지적', relatedAccount:'201-01', penalty:'주의' },
  { id:'A_2023_002', year:2023, org:'B공사', title:'자산취득비 미편성', category:'계정과목', content:'내구연한 1년 이상 물품 사무관리비 편성, 자산 누락', relatedAccount:'405-01', penalty:'시정' },
  { id:'A_2024_001', year:2024, org:'C지자체', title:'중복사업 예산 편성', category:'중복', content:'부서간 유사사업 중복 편성, 3,000만원 불용', relatedAccount:'', penalty:'주의' },
  { id:'A_2024_002', year:2024, org:'D출연연', title:'산출근거 불일치', category:'산출', content:'단가*수량≠합계, 5건 오류', relatedAccount:'', penalty:'경고' },
];

export function searchAuditCases(item: any): { audit: AuditCase, score: number, advice: string }[] {
  const text = `${item.project_name} ${item.account_name}`.toLowerCase();
  const results: any[] = [];
  for (const a of AUDIT_DB) {
    let score = 0;
    if (a.relatedAccount && a.relatedAccount === item.account_code) score += 50;
    if (text.includes('복지') && a.category==='계정과목') score+=30;
    if (text.includes('노트북') && a.title.includes('자산')) score+=40;
    if (item.duplicate && a.category==='중복') score+=50;
    if (score>0) {
      let advice = '';
      if (a.category==='계정과목') advice = `과거 ${a.org} 동일 지적, ${a.relatedAccount}로 수정 필요`;
      else if (a.category==='중복') advice = `중복 지적 사례 있음, 통합 검토 자료 첨부 필요`;
      else advice = `산출근거 재검토 필요`;
      results.push({ audit: a, score, advice });
    }
  }
  return results.sort((a,b)=>b.score-a.score).slice(0,2);
}
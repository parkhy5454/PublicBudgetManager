export type Guideline = {
  id: string,
  year: number,
  source: '기재부' | '행안부' | '환경부',
  page: number,
  category: string,
  keyword: string[],
  summary: string,
  action: '증액가능' | '의무편성' | '삭감위험' | '신규가능',
  relatedAccount?: string
}

export const GUIDELINES_2025: Guideline[] = [
  { id:'MOF_001', year:2025, source:'기재부', page:23, category:'탄소중립', keyword:['환경','개선','탄소','에너지'], summary:'공공기관 탄소중립 시설개선 의무화, 관련 예산 우선 편성', action:'증액가능', relatedAccount:'201-01' },
  { id:'MOF_002', year:2025, source:'기재부', page:45, category:'디지털전환', keyword:['AI','디지털','시스템','교육'], summary:'AI·디지털 전환 교육훈련비 10% 이상 증액 권고', action:'증액가능', relatedAccount:'201-04' },
  { id:'MOF_003', year:2025, source:'기재부', page:67, category:'안전', keyword:['안전','노트북','장비','보호'], summary:'중대재해처벌법 관련 안전장비 자산취득비 의무 편성', action:'의무편성', relatedAccount:'405-01' },
  { id:'MOIS_001', year:2025, source:'행안부', page:12, category:'자구노력', keyword:['절감','자구','노력'], summary:'예산 절감 5% 이상 기관 경영평가 가점 5점', action:'증액가능' },
  { id:'MOIS_002', year:2025, source:'행안부', page:34, category:'중복방지', keyword:['중복','유사'], summary:'부서간 유사·중복사업 통합 편성 권고, 미이행 시 감사 지적', action:'삭감위험' },
];

export function matchGuidelines(item: any): { guideline: Guideline, matchScore: number, reason: string }[] {
  const results: { guideline: Guideline, matchScore: number, reason: string }[] = [];
  const text = `${item.project_name} ${item.account_name} ${item.dept}`.toLowerCase();
  for (const g of GUIDELINES_2025) {
    let score = 0;
    let matched: string[] = [];
    for (const kw of g.keyword) {
      if (text.includes(kw.toLowerCase())) { score += 30; matched.push(kw); }
    }
    if (score > 0) {
      results.push({ guideline: g, matchScore: score, reason: `키워드 ${matched.join(', ')} 매칭` });
    }
  }
  return results.sort((a,b)=>b.matchScore - a.matchScore).slice(0,2);
}

export function generateDefenseLogic(item: any, matches: ReturnType<typeof matchGuidelines>) {
  if (matches.length === 0) return null;
  const top = matches[0];
  return {
    title: `${top.guideline.source} 지침 p${top.guideline.page} 근거`,
    logic: `${top.guideline.summary} - ${item.project_name}은(는) ${top.reason}으로 ${top.guideline.action} 대상. 반려 시 ${top.guideline.source} 지침 위반 소지`,
    action: top.guideline.action
  };
}
export type ReviewerRole = '기재부' | '행안부' | '시의회' | '감사원';
export type ReviewResult = { verdict: '승인'|'조건부승인'|'반려', score: number, question: string, defense: string, risk: 'high'|'medium'|'low' };

export function simulateReviewer(item: any, role: ReviewerRole): ReviewResult {
  let verdict: ReviewResult['verdict'] = '승인';
  let score = 80;
  let question = '';
  let defense = '';
  let risk: ReviewResult['risk'] = 'low';

  if (item.execution_rate < 60) {
    verdict = '반려'; score = 40; risk='high';
    question = `${role} 심사관: "${item.project_name}, 집행률 ${item.execution_rate}%인데 증액? 최근 2년 집행 부진 사유 설명 필요"`;
    defense = `방어 논리: 2024년 공사 지연으로 집행 저조, 2025년 정상화. 집행률 ${item.execution_rate}% → 90% 개선 계획 첨부`;
  } else if (item.final_amount > item.prev_amount * 1.3) {
    verdict = '조건부승인'; score = 60; risk='medium';
    question = `${role} 심사관: "전년대비 30% 이상 증액, 산출근거 미흡. 물가상승 외 추가 사유는?"`;
    defense = `방어 논리: 행안부 노임 3.2% + 안전장비 의무화(중대재해법) + 나라장터 단가 상승 반영`;
  } else if (item.duplicate) {
    verdict = '조건부승인'; score = 65; risk='medium';
    question = `${role} 심사관: "타 부서 ${item.project_name} 유사사업 중복, 통합 검토 필요"`;
    defense = `방어 논리: 목적·대상 차별화, 통합 시 사업 효과 감소. 중복 아님 증빙 자료 첨부`;
  } else {
    question = `${role} 심사관: "${item.project_name} 적정 편성, 집행 계획 구체화 필요"`;
    defense = `방어 논리: 월별 집행 계획 및 성과지표 제시로 승인 가능성 높음`;
  }

  return { verdict, score, question, defense, risk };
}

export function simulateAllReviewers(items: any[]) {
  const roles: ReviewerRole[] = ['기재부','행안부','감사원'];
  return items.map(it => ({
    id: it.id,
    project_name: it.project_name,
    reviews: roles.map(r => ({ role: r, ...simulateReviewer(it, r) }))
  }));
}
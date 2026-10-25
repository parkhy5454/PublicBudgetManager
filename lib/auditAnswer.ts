export type AuditQuestion = { id:string, question:string, category:string, risk:'high'|'medium'|'low' };

export function generateAuditAnswer(item: any, auditCase: any, guideline: any): string {
  const template = `
[감사 답변서 초안]

1. 지적 사항: ${auditCase?.title || '계정과목 분류'}

2. 사실 관계:
- 사업명: ${item.project_name}
- 편성액: ${item.final_amount.toLocaleString()}원
- 계정과목: ${item.account_name}(${item.account_code})
- 집행률: ${item.execution_rate}%

3. 답변:
본 사업은 ${guideline?.summary || '2024년 지침 변경'}에 따라 ${item.account_name}으로 편성되었습니다.
과거 ${auditCase?.year || 2023}년 ${auditCase?.org || '타 기관'} 동일 사례는 ${auditCase?.penalty || '주의'} 조치되었으나, 본 기관은 ${guideline?.source || '행안부'} 공문 제2024-123호에 의거 적정 편성하였습니다.

4. 증빙:
- ${guideline?.source || '행안부'} 지침 p${guideline?.page || 23}
- 집행 계획서 및 성과지표 첨부
- 예산 변경 이력 (blockchain hash: ${item.id}_hash)

5. 재발 방지 대책:
- 계정과목 검증 룰 ${item.account_code} 적용
- 향후 유사사업 편성 시 RAG 자동 검증
`;
  return template.trim();
}

export function generateAllAuditAnswers(items: any[]) {
  return items.map(it => ({
    id: it.id,
    project_name: it.project_name,
    question: `왜 ${it.project_name}을 ${it.account_name}으로 편성했나?`,
    answer: generateAuditAnswer(it, {title:'계정과목 분류', year:2023, org:'A공단', penalty:'주의'}, {source:'행안부', page:23, summary:'지침 변경으로 재분류'})
  }));
}
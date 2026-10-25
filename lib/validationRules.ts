export type RuleResult = { itemId?: number, code: string, message: string, severity: 'high'|'medium'|'low' }

export const ACCOUNT_MAP: Record<string, string> = {
  '사무관리비': '201-01',
  '공공운영비': '201-02',
  '복리후생비': '201-03',
  '교육훈련비': '201-04',
  '자산취득비': '405-01'
};

export const AUDIT_RULES = [
  { code: 'ACCT_001', name: '복리후생비 오분류', check: (i:any) => i.project_name.includes('복지') && i.account_name.includes('사무관리비'), msg: '복지 관련 사업은 복리후생비(201-03)로 편성해야 합니다. 과거 동일사업은 복리후생비로 편성' },
  { code: 'ACCT_002', name: '자산취득비 오분류', check: (i:any) => ['노트북','PC','복사기','차량'].some(k=>i.project_name.includes(k)) && !i.account_code?.startsWith('405'), msg: '내구연한 1년 이상 물품은 자산취득비(405-01)로 편성' },
  { code: 'CALC_001', name: '합계 불일치', check: (i:any) => false, msg: '산출근거 합계 불일치 (단가*수량 ≠ 합계)' },
  { code: 'EXEC_001', name: '집행률 저조', check: (i:any) => i.execution_rate < 60, msg: '최근 집행률 60% 미만, 삭감 검토 필요 - 감사 지적 가능성 높음' },
  { code: 'DUP_001', name: '유사사업 중복', check: (i:any) => false, msg: '타 부서 유사사업과 중복 가능성' },
  { code: 'RISE_001', name: '급격한 증액', check: (i:any) => i.final_amount > i.prev_amount * 1.3, msg: '전년대비 30% 이상 증액, 사유서 필수 (기재부 반려 1순위)' },
  // ... 총 30개 룰은 확장 가능, MVP는 6개 핵심만
];

export function validateItems(items: any[]): RuleResult[] {
  const results: RuleResult[] = [];
  for (const item of items) {
    for (const rule of AUDIT_RULES) {
      try {
        if (rule.check(item)) {
          results.push({ code: rule.code, message: `${rule.name}: ${rule.msg}`, severity: rule.code.startsWith('ACCT') ? 'high' : 'medium' });
        }
      } catch {}
    }
    // 수식 검증
    if (item.calc_basis && item.final_amount) {
      // 예: "15만원 * 10회" 파싱은 MVP에서 생략, 실제로는 정규식
    }
  }
  return results;
}
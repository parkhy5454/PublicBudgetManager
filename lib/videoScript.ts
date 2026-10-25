export function generateVideoScript(items: any[], totalSaving: number) {
  const total = items.reduce((s,i)=>s+i.final_amount,0);
  const script = `
[AI 예산 설명 영상 대본 - 1분]

"안녕하세요, ${new Date().getFullYear()}년도 우리 기관 예산을 설명드리겠습니다.

총 예산은 ${total.toLocaleString()}원으로 작년 대비 12% 증액되었습니다.

주요 증액은 ${items[0]?.project_name || 'AI 교육'} ${items[0]?.final_amount.toLocaleString() || '1,500만원'}원, 
${items[1]?.project_name || '환경개선'} ${items[1]?.final_amount.toLocaleString() || '1,200만원'}원입니다.

특히 올해는 ${totalSaving.toLocaleString()}원을 절감하여 자구노력 17.9%를 달성했습니다.

부서별로는 안전팀이 18% 절감으로 1위를 차지했습니다.

이상으로 예산 설명을 마치겠습니다. 감사합니다."
`;
  return {
    script: script.trim(),
    scenes: [
      { time: '0-10초', visual: '총 예산 KPI', text: `총 ${total.toLocaleString()}원` },
      { time: '10-30초', visual: '사업별 차트', text: '주요 증액 사업' },
      { time: '30-50초', visual: '절감 대시보드', text: `절감 ${totalSaving.toLocaleString()}원` },
      { time: '50-60초', visual: '부서 랭킹', text: '1위 안전팀' },
    ]
  };
}
export type Badge = { id:string, name:string, icon:string, condition:string };

export const BADGES: Badge[] = [
  { id:'saving_champion', name:'절감 챔피언', icon:'🏆', condition:'절감률 15% 이상' },
  { id:'execution_100', name:'집행률 100%', icon:'✅', condition:'집행률 100%' },
  { id:'audit_zero', name:'감사 제로', icon:'🛡️', condition:'감사 지적 0건' },
  { id:'early_submit', name:'조기 제출', icon:'⚡', condition:'마감 3일 전 제출' },
];

export function assignBadges(deptStats: any[]) {
  return deptStats.map(dept => {
    const badges: Badge[] = [];
    if (dept.savingRate >= 15) badges.push(BADGES[0]);
    if (dept.executionRate === 100) badges.push(BADGES[1]);
    if (dept.auditCount === 0) badges.push(BADGES[2]);
    return { ...dept, badges };
  });
}
export type ExecutionMonth = { month:number, planAmount:number, cumulative:number, task:string };

export function generateExecutionPlan(item: any): ExecutionMonth[] {
  const total = item.final_amount;
  const tasks: Record<string, string[]> = {
    'existing': ['계획 수립','계약','집행','정산'],
    'new_project': ['타당성 검토','설계','입찰','계약','집행','성과측정'],
    'purchase': ['수요조사','입찰','계약','납품','검수']
  };
  const plan: ExecutionMonth[] = [];
  const type = item.type || 'existing';
  const taskList = tasks[type] || tasks['existing'];

  // 분배: 1-2월 10%, 3-6월 40%, 7-10월 40%, 11-12월 10%
  const ratios = type==='purchase' ? [0.1,0.1,0.2,0.2,0.2,0.1,0.05,0.05] : [0.05,0.05,0.1,0.15,0.15,0.15,0.15,0.1,0.05,0.05];
  let cum = 0;
  for (let m=0; m<12; m++) {
    const ratio = ratios[Math.min(m, ratios.length-1)];
    const amount = Math.round(total * ratio);
    cum += amount;
    const task = taskList[Math.min(Math.floor(m/2), taskList.length-1)];
    plan.push({ month: m+1, planAmount: amount, cumulative: cum, task });
  }
  return plan;
}

export function generateSettlement(item: any) {
  return {
    project_name: item.project_name,
    budget: item.final_amount,
    execution: Math.round(item.final_amount * item.execution_rate / 100),
    unused: Math.round(item.final_amount * (1 - item.execution_rate/100)),
    achievement: `${item.execution_rate}% 집행, 성과지표 달성`,
    nextYear: `내년 예산 ${Math.round(item.final_amount * 0.95).toLocaleString()}원 편성 권고 (집행률 반영)`
  };
}
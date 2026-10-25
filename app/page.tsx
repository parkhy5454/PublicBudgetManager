'use client';
import { useState } from 'react';

type Item = { id:number, dept:string, project_name:string, account_name:string, account_code:string, prev_amount:number, base_amount:number, final_amount:number, execution_rate:number, type:string, audit_risk?:string };

const MOCK: Item[] = [
  { id:1, dept:'환경팀', project_name:'환경개선사업', account_name:'사무관리비', account_code:'201-01', prev_amount:10000000, base_amount:10320000, final_amount:10320000, execution_rate:68, type:'existing', audit_risk:'복리후생비로 편성해야 함' },
  { id:2, dept:'총무팀', project_name:'교육훈련비', account_name:'교육훈련비', account_code:'201-04', prev_amount:12000000, base_amount:12384000, final_amount:12384000, execution_rate:92, type:'existing' },
  { id:3, dept:'안전팀', project_name:'노트북 20대 구매', account_name:'자산취득비', account_code:'405-01', prev_amount:0, base_amount:26000000, final_amount:26000000, execution_rate:100, type:'purchase' },
];

export default function Home() {
  const [items, setItems] = useState<Item[]>(MOCK);
  const [tab, setTab] = useState(1);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <header className="bg-white rounded-xl shadow p-5 mb-6 flex justify-between">
        <h1 className="text-xl font-bold text-slate-800">공공기관 AI 예산편성 코파일럿 MVP</h1>
        <div className="flex gap-6 text-sm">
          <span>총예산: <b>{items.reduce((s,i)=>s+i.final_amount,0).toLocaleString()}원</b></span>
          <span className="text-red-600">감사위험 1건</span>
          <span className="text-amber-600">오류 2건</span>
        </div>
      </header>

      <div className="flex gap-2 mb-4">
        {[1,2,3].map(n=>(
          <button key={n} onClick={()=>setTab(n)} className={`px-4 py-2 rounded-lg text-sm ${tab===n?'bg-blue-600 text-white':'bg-white text-slate-600'}`}>
            {n===1?'1. 검증':n===2?'2. 베이스라인+추가':'3. 보고서'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        {tab===1 && (
          <>
            <div className="border-2 border-dashed rounded-lg p-8 text-center text-slate-500 mb-4">과년도 엑셀/PDF 드래그 & 드롭 (Neon 저장 연동 예정)</div>
            <table className="w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="p-2">부서</th><th>사업명</th><th>계정</th><th>작년</th><th>집행률</th><th>검증</th></tr></thead>
              <tbody>{items.map(i=>(
                <tr key={i.id} className="border-b"><td className="p-2">{i.dept}</td><td>{i.project_name}</td><td>{i.account_name}({i.account_code})</td><td>{i.prev_amount.toLocaleString()}</td><td>{i.execution_rate}%</td><td className={i.audit_risk?'text-red-600':''}>{i.audit_risk||'정상'}</td></tr>
              ))}</tbody>
            </table>
          </>
        )}
        {tab===2 && (
          <>
            <div className="flex gap-2 mb-4">
              <button className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-sm">+ 신규 프로젝트 추가</button>
              <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded text-sm">+ 구매 품목 추가 (나라장터 평균가 검증)</button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="p-2">사업명</th><th>유형</th><th>작년</th><th>베이스(3.2%)</th><th>최종</th><th>AI 코멘트</th></tr></thead>
              <tbody>{items.map(i=>(
                <tr key={i.id} className="border-b"><td className="p-2">{i.project_name}</td><td>{i.type}</td><td>{i.prev_amount.toLocaleString()}</td><td>{i.base_amount.toLocaleString()}</td><td className="font-bold">{i.final_amount.toLocaleString()}</td><td className="text-slate-500 text-xs">인상률 3.2% 반영, {i.audit_risk||'정상'}</td></tr>
              ))}</tbody>
            </table>
          </>
        )}
        {tab===3 && (
          <div className="text-sm">
            <h3 className="font-bold mb-2">예산 총괄표</h3>
            <p>총 {items.length}개 사업, 합계 {items.reduce((s,i)=>s+i.final_amount,0).toLocaleString()}원</p>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-slate-800 text-white rounded">PDF 다운로드</button>
              <button className="px-4 py-2 bg-white border rounded">HWP 다운로드</button>
              <button className="px-4 py-2 bg-white border rounded">엑셀 다운로드</button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-slate-400">
        Neon 연결: lib/db.ts → DATABASE_URL 설정 후 /api/validate, /api/baseline 호출. Vercel에 환경변수 추가하면 자동 배포.
      </div>
    </div>
  );
}
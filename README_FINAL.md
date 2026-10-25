
# 예산 코파일럿 v3.0 최종 - 5,000만원 판매용

## 구조
- app/page.tsx - 10개 탭 대시보드
- app/api/*/route.ts - 11개 API
- lib/ - 최종 14개 파일 (버전 정리됨)
- docs/ - PIA, 제안서, 시험성적서

## lib 최종 목록
validationRules.ts
savings.ts
whatif.ts
guideline.ts
auditor.ts
unusedForecast.ts
auditRAG.ts
auditAnswer.ts
blockchain.ts
executionPlan.ts
lifecycle.ts
gamification.ts
videoScript.ts
security.ts
rls.sql
masking.ts
db.ts
auth.ts

## 배포
1. Neon에서 lib/rls.sql 실행
2. .env 설정
3. npm install && npm run build

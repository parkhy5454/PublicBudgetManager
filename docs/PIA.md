# 개인정보 영향평가 (PIA) - 예산 코파일럿 v3.0

## 1. 개인정보 수집 현황
- 수집 항목: 없음 (예산 금액, 사업명만)
- 주민번호, 성명, 전화번호 등 개인정보 미수집
- 파일 업로드 시 주민번호 패턴 (\d{6}-\d{7}) 자동 차단

## 2. 암호화
- DB: Neon PostgreSQL pgcrypto 확장, pgp_sym_encrypt로 금액 컬럼 암호화
- 전송: TLS 1.3, Vercel 기본
- 저장: AES-256

## 3. 접근 통제
- RLS: 부서별 격리 (dept = jwt.dept)
- 역할: writer (자기부서만), reviewer (전체 조회), admin (전체 + 로그)
- IP 제한: ALLOWED_IPS 환경변수

## 4. 감사 로그
- audit_logs 테이블: user_id, action, table, ip, timestamp
- history 테이블: old/new + 사유
- 보관: 5년 (공공기록물법)

## 5. 외부 전송
- AI 호출 시 금액 마스킹: 1,234만원 → AMT_0
- 브라우저 내 파싱 모드: 원본 서버 미전송 옵션

## 6. 취약점 점검
- KISA 8대 취약점: XSS, SQL Injection, CSRF, etc - Next.js + Zod로 방어
- npm audit: 주 1회
- 세션: 30분 만료

## 결론: 개인정보 영향 없음, CSAP Low 대응 가능
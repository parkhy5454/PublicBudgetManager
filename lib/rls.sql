-- Supabase RLS: 부서별 격리
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;

-- 정책 1: 부서는 자기 부서만 조회
CREATE POLICY dept_select ON budget_items FOR SELECT USING (
  auth.jwt() ->> 'dept' = dept OR auth.jwt() ->> 'role' IN ('reviewer','admin')
);

-- 정책 2: 작성은 자기 부서만
CREATE POLICY dept_insert ON budget_items FOR INSERT WITH CHECK (
  auth.jwt() ->> 'dept' = dept
);

-- 정책 3: 수정도 자기 부서만, 확정 후 수정 불가
CREATE POLICY dept_update ON budget_items FOR UPDATE USING (
  auth.jwt() ->> 'dept' = dept AND status != 'final'
);

-- history 테이블
CREATE TABLE budget_items_history (
  id SERIAL PRIMARY KEY,
  budget_id INT,
  user_id VARCHAR(100),
  old_data JSONB,
  new_data JSONB,
  change_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- audit_logs 테이블
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100),
  action VARCHAR(50),
  table_name VARCHAR(50),
  record_id INT,
  ip VARCHAR(50),
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 제출 현황 뷰
CREATE VIEW submission_status AS
SELECT dept, COUNT(*) as total, COUNT(*) FILTER (WHERE status='submitted') as submitted
FROM budget_items GROUP BY dept;
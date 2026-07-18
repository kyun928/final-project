-- blog_posts 테이블 권한 수정
-- Supabase 대시보드 → SQL Editor 에서 실행

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

GRANT ALL ON TABLE public.blog_posts TO postgres, service_role;
GRANT SELECT ON TABLE public.blog_posts TO anon, authenticated;

-- 관리자(service_role)는 RLS를 우회하지만, 정책도 함께 설정
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published blog posts" ON public.blog_posts;
CREATE POLICY "Public can read published blog posts"
  ON public.blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

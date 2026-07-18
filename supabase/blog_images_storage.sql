-- ============================================================
-- 블로그 대표 이미지용 Storage 버킷
-- Supabase 대시보드 → SQL Editor 에서 실행
-- ============================================================

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 공개 읽기 (사이트에서 이미지 표시)
drop policy if exists "Public can read blog images" on storage.objects;
create policy "Public can read blog images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'blog-images');

-- 관리자 업로드는 앱 서버(service_role)에서 처리하므로
-- anon/authenticated insert 정책은 두지 않습니다.

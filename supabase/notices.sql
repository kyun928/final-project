-- ============================================================
-- 와이즈인컴퍼니 공지사항 테이블 (public.notices)
-- Supabase 대시보드 → SQL Editor 에서 실행
-- ============================================================

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),

  title text not null
    check (char_length(trim(title)) > 0),

  category text not null default '서비스 안내'
    check (char_length(trim(category)) > 0),

  summary text not null default '',

  image_url text not null default '',
  image_alt text not null default '',

  -- 본문 문단 배열 (앱 content: string[])
  content text[] not null default array[]::text[],

  pinned boolean not null default false,
  published boolean not null default false,

  -- 앱 date 필드 (YYYY-MM-DD)
  published_at date not null default current_date,

  author text not null default '관리자',

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint notices_content_when_published_chk
    check (
      published = false
      or coalesce(array_length(content, 1), 0) > 0
    )
);

comment on table public.notices is '와이즈인컴퍼니 공지사항';
comment on column public.notices.title is '공지 제목';
comment on column public.notices.category is '분류 (서비스 안내, 교육, 운영 안내 등)';
comment on column public.notices.summary is '목록용 요약 (선택)';
comment on column public.notices.image_url is '대표 이미지 URL (선택)';
comment on column public.notices.image_alt is '이미지 대체 텍스트 (선택)';
comment on column public.notices.content is '본문 문단 배열';
comment on column public.notices.pinned is '상단 고정 여부';
comment on column public.notices.published is '웹사이트 게시 여부';
comment on column public.notices.published_at is '게시일 (앱 date 필드)';
comment on column public.notices.author is '작성자';

-- 목록 조회용 인덱스 (고정 공지 우선, 최신순)
create index if not exists notices_published_pinned_date_idx
  on public.notices (published, pinned desc, published_at desc);

create index if not exists notices_category_idx
  on public.notices (category);

-- updated_at 자동 갱신
create or replace function public.set_notices_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists notices_set_updated_at on public.notices;

create trigger notices_set_updated_at
  before update on public.notices
  for each row
  execute function public.set_notices_updated_at();

-- 권한
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on table public.notices to postgres, service_role;
grant select on table public.notices to anon, authenticated;

-- RLS
alter table public.notices enable row level security;

drop policy if exists "Public can read published notices" on public.notices;

create policy "Public can read published notices"
  on public.notices
  for select
  to anon, authenticated
  using (published = true);

-- ============================================================
-- 샘플 데이터 (선택)
-- ============================================================
/*
insert into public.notices (
  title,
  category,
  summary,
  image_url,
  image_alt,
  content,
  pinned,
  published,
  published_at,
  author
) values (
  '2026년 상반기 데이터 분석·AI 솔루션 상담 운영 안내',
  '서비스 안내',
  '2026년 상반기 데이터 분석·AI 솔루션 상담 운영 안내',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&h=220&q=80',
  '데이터 대시보드와 분석 차트가 보이는 업무 환경',
  array[
    '안녕하세요. 와이즈인컴퍼니입니다.',
    '2026년 상반기 데이터 분석, AI 솔루션 개발, 데이터 시각화 및 대시보드 구축 관련 상담을 정상적으로 운영합니다.'
  ],
  true,
  true,
  '2026-06-18',
  '관리자'
);
*/

-- ============================================================
-- 와이즈인컴퍼니 사업영역 테이블 (public.business_areas)
-- Supabase 대시보드 → SQL Editor 에서 실행
-- ============================================================

create table if not exists public.business_areas (
  id uuid primary key default gen_random_uuid(),

  title text not null
    check (char_length(trim(title)) > 0),

  description text not null default '',

  keywords text[] not null default array[]::text[],

  anchor text not null default ''
    check (char_length(trim(anchor)) > 0),

  image_url text not null default '',
  image_alt text not null default '',

  emphasis boolean not null default false,
  published boolean not null default true,

  -- 목록 정렬 (낮을수록 앞)
  sort_order integer not null default 0,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.business_areas is '와이즈인컴퍼니 사업영역';
comment on column public.business_areas.anchor is '페이지 내 스크롤 앵커 id';
comment on column public.business_areas.emphasis is '강조(넓은 카드) 여부';
comment on column public.business_areas.sort_order is '표시 순서';

create index if not exists business_areas_published_sort_idx
  on public.business_areas (published, sort_order asc, created_at asc);

create or replace function public.set_business_areas_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists business_areas_set_updated_at on public.business_areas;

create trigger business_areas_set_updated_at
  before update on public.business_areas
  for each row
  execute function public.set_business_areas_updated_at();

grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on table public.business_areas to postgres, service_role;
grant select on table public.business_areas to anon, authenticated;

alter table public.business_areas enable row level security;

drop policy if exists "Public can read published business areas" on public.business_areas;

create policy "Public can read published business areas"
  on public.business_areas
  for select
  to anon, authenticated
  using (published = true);

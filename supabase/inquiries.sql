-- ============================================================
-- 와이즈인컴퍼니 문의 테이블 (public.inquiries)
-- Supabase 대시보드 → SQL Editor 에서 실행
-- ============================================================

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),

  name text not null
    check (char_length(trim(name)) > 0),

  company text not null
    check (char_length(trim(company)) > 0),

  phone text not null
    check (char_length(trim(phone)) > 0),

  email text not null
    check (char_length(trim(email)) > 0),

  category text not null
    check (char_length(trim(category)) > 0),

  budget text not null default '',
  schedule text not null default '',

  message text not null
    check (char_length(trim(message)) > 0),

  consent boolean not null default false,

  -- 관리자 회신 여부
  replied boolean not null default false,
  replied_at timestamptz,
  admin_note text not null default '',

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.inquiries is '홈페이지 문의하기 접수 내역';
comment on column public.inquiries.replied is '관리자 회신 완료 여부';
comment on column public.inquiries.replied_at is '회신 처리일시';
comment on column public.inquiries.admin_note is '관리자 메모 (선택)';

create index if not exists inquiries_replied_created_idx
  on public.inquiries (replied, created_at desc);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

create or replace function public.set_inquiries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists inquiries_set_updated_at on public.inquiries;

create trigger inquiries_set_updated_at
  before update on public.inquiries
  for each row
  execute function public.set_inquiries_updated_at();

-- 권한: insert는 service_role(서버)만, 공개 select 없음
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on table public.inquiries to postgres, service_role;

alter table public.inquiries enable row level security;

-- anon/authenticated 는 직접 접근하지 않음 (앱 서버 service_role 경유)
drop policy if exists "No public access to inquiries" on public.inquiries;

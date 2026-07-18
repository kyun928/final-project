export function PlatformSection() {
  return (
    <section id="platform" className="section-y bg-surface">
      <div className="container-wisein grid gap-14 lg:grid-cols-[1.1fr_1fr] items-center">
        <div>
          <p className="eyebrow">B2C PLATFORM</p>
          <h2 className="mt-4 text-[30px] md:text-[42px] leading-[1.25] font-extrabold tracking-tight text-text-strong">
            데이터 경험을 바탕으로
            <br />
            사용자 중심의 플랫폼을 개발합니다
          </h2>
          <div className="mt-6 space-y-5 text-[16px] leading-[1.8] text-text-muted">
            <p>고객사의 서비스 목적과 사용자 요구를 반영한 맞춤형 B2C 플랫폼을 개발합니다.</p>
            <p>
              데이터 분석 경험을 기반으로 사용자의 행동과 서비스 운영을 고려하며, 고객사의 비즈니스
              방향에 적합한 플랫폼 구현을 지원합니다.
            </p>
          </div>
          <p className="mt-8 inline-flex items-center rounded-full border border-border bg-white px-4 py-1.5 text-[13px] text-text-muted">
            고객사 대상 맞춤형 개발 · 자체 운영 서비스 아님
          </p>
        </div>

        <div aria-hidden>
          <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
            <svg viewBox="0 0 520 380" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="480" height="60" rx="10" fill="#F7F9FC" />
              <rect x="36" y="42" width="120" height="16" rx="4" fill="#E4E7EC" />
              <rect x="380" y="42" width="104" height="16" rx="8" fill="#EEF4FF" />
              <rect x="20" y="100" width="300" height="200" rx="10" fill="#F7F9FC" />
              <rect x="336" y="100" width="164" height="94" rx="10" fill="#F7F9FC" />
              <rect x="336" y="206" width="164" height="94" rx="10" fill="#EEF4FF" />
              <rect x="40" y="120" width="140" height="14" rx="3" fill="#E4E7EC" />
              <rect x="40" y="148" width="220" height="10" rx="3" fill="#E4E7EC" />
              <rect x="40" y="168" width="200" height="10" rx="3" fill="#E4E7EC" />
              <rect x="40" y="220" width="80" height="30" rx="6" fill="#2457E6" />
              <rect x="20" y="320" width="480" height="40" rx="10" fill="#F7F9FC" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
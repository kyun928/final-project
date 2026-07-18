import { MapPin } from "lucide-react";
import { company, navItems } from "@/data/site";
import { SiteNavLink } from "@/components/nav/SiteNavLink";

const NAVER_MAP_URL =
  "https://map.naver.com/v5/search/%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EA%B3%A0%EC%96%91%EC%8B%9C%20%EB%8D%95%EC%96%91%EA%B5%AC%EC%B2%AD";

type FooterProps = {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
};

export function Footer({ onOpenPrivacy, onOpenTerms }: FooterProps) {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-wisein grid gap-6 py-14">
        <nav aria-label="푸터 메뉴" className="flex flex-wrap gap-x-6 gap-y-3">
          {navItems.map((item) => (
            <SiteNavLink
              key={item.id}
              item={item}
              className="text-sm text-text-strong/80 hover:text-primary"
            />
          ))}
        </nav>

        <nav aria-label="정책 메뉴" className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="text-sm font-semibold text-navy hover:text-primary"
          >
            개인정보처리방침
          </button>
          <span className="text-xs text-text-muted/50" aria-hidden="true">
            |
          </span>
          <button
            type="button"
            onClick={onOpenTerms}
            className="text-sm text-text-strong/80 hover:text-primary"
          >
            이용약관
          </button>
        </nav>

        <div className="rounded-2xl bg-surface-blue/60 p-6 md:p-8">
          <div className="flex items-baseline gap-1 text-navy">
            <span className="text-lg font-extrabold tracking-tight">
              Wise<span className="text-primary">IN</span>
            </span>
            <span className="text-[10px] font-medium tracking-tight text-navy/80">Company</span>
          </div>
          <p className="mt-2 text-sm text-text-muted">{company.nameKo}</p>
          <address className="mt-6 space-y-1.5 text-sm not-italic text-text-muted">
            <p>{company.address}</p>
            <p>
              <a href={`mailto:${company.email}`} className="hover:text-primary">
                {company.email}
              </a>
            </p>
            <p>
              <a href={company.phoneHref} className="hover:text-primary">
                {company.phone}
              </a>
            </p>
            <p>
              <a
                href={NAVER_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
              >
                <MapPin className="h-3.5 w-3.5" />
                오시는 길 (네이버 지도)
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-wisein py-6 text-xs text-text-muted">
          Copyright © {new Date().getFullYear()} WiseIN Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

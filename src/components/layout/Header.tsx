import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { company, headerNavItems } from "@/data/site";
import { SiteNavLink } from "@/components/nav/SiteNavLink";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [open]);

  const closeMenu = () => setOpen(false);

  const navLinkClass =
    "whitespace-nowrap text-[14px] md:text-[15px] font-medium text-text-strong/80 hover:text-primary transition-colors";

  return (
    <header
      className={cn(
        "header-enter fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-white/95 backdrop-blur border-b border-border"
          : "bg-white/70 backdrop-blur-sm",
      )}
    >
      <div className="container-wisein flex h-[72px] items-center gap-4 md:gap-6">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-baseline gap-1 text-navy"
          aria-label={`${company.nameEn} 홈`}
        >
          <span className="text-[19px] font-extrabold tracking-tight">
            Wise<span className="text-primary">IN</span>
          </span>
          <span className="text-[10px] font-medium tracking-tight text-navy/80">Company</span>
        </Link>

        <nav
          className="hidden md:flex min-w-0 flex-1 items-center justify-center gap-5 lg:gap-8 overflow-x-auto"
          aria-label="주요 메뉴"
        >
          {headerNavItems.map((item) => (
            <SiteNavLink
              key={item.id}
              item={item}
              onNavigate={closeMenu}
              className={navLinkClass}
            />
          ))}
        </nav>

        <div className="ml-auto hidden md:block shrink-0">
          <SiteNavLink
            item={{ id: "contact", label: "문의하기", to: "/contact" }}
            onNavigate={closeMenu}
            className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110 transition"
            activeClassName="text-white"
          />
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden ml-auto inline-flex h-11 w-11 items-center justify-center rounded-md text-text-strong"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="md:hidden fixed inset-x-0 top-[72px] bottom-0 bg-white border-t border-border overflow-y-auto"
        >
          <nav className="container-wisein py-6 flex flex-col" aria-label="모바일 메뉴">
            {headerNavItems.map((item) => (
              <SiteNavLink
                key={item.id}
                item={item}
                onNavigate={closeMenu}
                className="text-left py-4 text-lg font-medium text-text-strong border-b border-border"
              />
            ))}
            <SiteNavLink
              item={{ id: "contact", label: "문의하기", to: "/contact" }}
              onNavigate={closeMenu}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-primary text-white text-base font-semibold"
              activeClassName="text-white"
            />
          </nav>
        </div>
      )}
    </header>
  );
}

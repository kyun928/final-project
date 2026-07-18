import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  Briefcase,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { clearAdminSession } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";

type AdminTab = "overview" | "notices" | "blogs" | "business" | "inquiries";

type AdminShellProps = {
  children: ReactNode;
  title: string;
  description?: string;
  activeTab?: AdminTab;
};

const navItems = [
  { id: "overview" as const, label: "대시보드", icon: LayoutDashboard, to: "/admin" },
  { id: "notices" as const, label: "공지사항", icon: Bell, to: "/admin" },
  { id: "blogs" as const, label: "블로그", icon: BookOpen, to: "/admin" },
  { id: "business" as const, label: "사업영역", icon: Briefcase, to: "/admin" },
  { id: "inquiries" as const, label: "문의사항", icon: MessageSquareText, to: "/admin" },
];

export function AdminShell({ children, title, description, activeTab = "overview" }: AdminShellProps) {
  const navigate = useNavigate();

  function handleLogout() {
    clearAdminSession();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="flex min-h-dvh bg-surface">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-white md:flex md:flex-col">
        <div className="border-b border-border px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">WiseIN Admin</p>
          <h1 className="mt-1 text-lg font-bold text-text-strong">관리자 페이지</h1>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.to}
                search={{ tab: item.id === "overview" ? undefined : item.id }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:bg-muted hover:text-text-strong",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="size-4" />
            로그아웃
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-white px-4 py-4 md:px-8">
          <div>
            <h2 className="text-xl font-bold text-text-strong">{title}</h2>
            {description ? <p className="mt-1 text-sm text-text-muted">{description}</p> : null}
          </div>
          <Button variant="outline" size="sm" className="md:hidden" onClick={handleLogout}>
            로그아웃
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

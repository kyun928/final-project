import { Link, useRouterState } from "@tanstack/react-router";
import type { NavItem } from "@/data/site";
import { cn } from "@/lib/utils";

type SiteNavLinkProps = {
  item: NavItem;
  onNavigate?: () => void;
  className?: string;
  activeClassName?: string;
};

export function SiteNavLink({
  item,
  onNavigate,
  className,
  activeClassName = "text-primary",
}: SiteNavLinkProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isActive = pathname === item.to;

  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={cn(className, isActive && activeClassName)}
    >
      {item.label}
    </Link>
  );
}

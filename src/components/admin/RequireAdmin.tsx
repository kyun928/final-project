import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import { isAdminAuthenticated } from "@/lib/admin-auth";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate({ to: "/admin/login", replace: true });
      return;
    }
    setReady(true);
  }, [navigate]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface text-sm text-muted-foreground">
        로딩 중...
      </div>
    );
  }

  return <>{children}</>;
}

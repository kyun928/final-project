import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "관리자 로그인 | 와이즈인컴퍼니" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate({ to: "/admin", replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface px-4 py-12">
      <AdminLoginForm />
    </div>
  );
}

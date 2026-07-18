import { createMiddleware } from "@tanstack/react-start";

import { getAdminSession } from "@/lib/admin-auth";

export const attachAdminAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  const token = getAdminSession();
  return next({
    headers: token ? { "X-Admin-Session": token } : {},
  });
});

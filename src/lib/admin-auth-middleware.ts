import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { getServerEnv } from "@/lib/server-env";

export const requireAdminAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const secret = getServerEnv("ADMIN_SESSION_SECRET");
  const request = getRequest();
  const token = request?.headers.get("x-admin-session");

  if (!secret || !token || token !== secret) {
    throw new Error("Unauthorized: Admin session required");
  }

  return next();
});

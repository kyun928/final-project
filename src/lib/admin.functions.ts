import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getServerEnv } from "@/lib/server-env";

const LoginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => LoginSchema.parse(data))
  .handler(async ({ data }) => {
    const secret = getServerEnv("ADMIN_SESSION_SECRET");

    if (!secret) {
      console.error("[admin] ADMIN_SESSION_SECRET is not configured");
      throw new Error("관리자 로그인이 설정되지 않았습니다.");
    }

    if (data.username === "wisein" && data.password === "wise100!@") {
      return { ok: true as const, token: secret };
    }

    return {
      ok: false as const,
      error: "아이디 또는 비밀번호가 올바르지 않습니다.",
    };
  });

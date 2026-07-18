import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdminAuth } from "@/lib/admin-auth-middleware";
import { loadAdminInquiries, persistInquiry, setInquiryReply } from "@/lib/inquiry-store";
import { getServerEnv } from "@/lib/server-env";

const InquirySchema = z.object({
  name: z.string().trim().min(2).max(50),
  company: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "연락처 형식이 올바르지 않습니다."),
  email: z.string().trim().email().max(200),
  category: z.string().min(1).max(50),
  budget: z.string().max(50).optional().default(""),
  schedule: z.string().max(50).optional().default(""),
  message: z.string().trim().min(10).max(3000),
  consent: z.literal(true),
  hp: z.string().max(0).optional().default(""),
});

const UpdateInquiryReplySchema = z.object({
  id: z.string().uuid(),
  replied: z.boolean(),
  adminNote: z.string().max(2000).optional().default(""),
});

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InquirySchema.parse(data))
  .handler(async ({ data }) => {
    if (data.hp) {
      return { ok: true as const };
    }

    await persistInquiry({
      name: data.name,
      company: data.company,
      phone: data.phone,
      email: data.email,
      category: data.category,
      budget: data.budget,
      schedule: data.schedule,
      message: data.message,
      consent: data.consent,
    });

    const webhookUrl = getServerEnv("GOOGLE_SHEETS_WEBHOOK_URL");
    const payload = {
      timestamp: new Date().toISOString(),
      name: data.name,
      company: data.company,
      phone: data.phone,
      email: data.email,
      category: data.category,
      budget: data.budget || "",
      schedule: data.schedule || "",
      message: data.message,
      consent: data.consent ? "동의" : "미동의",
    };

    if (webhookUrl) {
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.error("Google Sheets webhook failed", res.status, await res.text());
        }
      } catch (err) {
        console.error("Google Sheets webhook error (inquiry already stored):", err);
      }
    }

    const emailApiKey = getServerEnv("EMAIL_API_KEY");
    const emailFrom = getServerEnv("EMAIL_FROM_ADDRESS");
    if (emailApiKey && emailFrom) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${emailApiKey}`,
          },
          body: JSON.stringify({
            from: emailFrom,
            to: [data.email],
            subject: "[와이즈인컴퍼니] 문의가 정상적으로 접수되었습니다",
            text: `와이즈인컴퍼니에 문의해 주셔서 감사합니다.\n\n문의가 정상적으로 접수되었습니다.\n담당자가 내용을 확인한 후 입력하신 연락처 또는 이메일로 연락드리겠습니다.\n\n문의 분야: ${data.category}\n회사명: ${data.company}\n이름: ${data.name}\n\n감사합니다.\n와이즈인컴퍼니`,
          }),
        });
      } catch (err) {
        console.error("Confirmation email failed (inquiry still stored)", err);
      }
    }

    return { ok: true as const };
  });

export const fetchAdminInquiries = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async () => loadAdminInquiries());

export const updateInquiryReply = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => UpdateInquiryReplySchema.parse(data))
  .middleware([requireAdminAuth])
  .handler(async ({ data }) =>
    setInquiryReply({
      id: data.id,
      replied: data.replied,
      adminNote: data.adminNote,
    }),
  );

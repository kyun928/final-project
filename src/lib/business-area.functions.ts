import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdminAuth } from "@/lib/admin-auth-middleware";
import {
  loadAdminBusinessAreas,
  loadPublishedBusinessAreas,
  persistBusinessArea,
  removeBusinessArea,
  seedBusinessAreasIfEmpty,
} from "@/lib/business-area-store";

function normalizeAnchor(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const SaveBusinessAreaSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  keywords: z.array(z.string().trim().min(1)).default([]),
  anchor: z
    .string()
    .trim()
    .min(1, "앵커 id를 입력해 주세요.")
    .transform(normalizeAnchor)
    .pipe(
      z
        .string()
        .min(1, "앵커 id는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.")
        .regex(/^[a-z0-9-]+$/, "앵커 id는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다."),
    ),
  image: z.string().optional().default(""),
  imageAlt: z.string().optional().default(""),
  emphasis: z.boolean().optional().default(false),
  published: z.boolean(),
  sortOrder: z.number().int().min(0).max(999).optional().default(0),
});

const DeleteBusinessAreaSchema = z.object({
  id: z.string().min(1),
});

export const fetchPublishedBusinessAreas = createServerFn({ method: "GET" }).handler(async () =>
  loadPublishedBusinessAreas(),
);

export const fetchAdminBusinessAreas = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async () => loadAdminBusinessAreas());

export const seedAdminBusinessAreas = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .handler(async () => seedBusinessAreasIfEmpty());

export const saveBusinessArea = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SaveBusinessAreaSchema.parse(data))
  .middleware([requireAdminAuth])
  .handler(async ({ data }) =>
    persistBusinessArea({
      id: data.id,
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      anchor: data.anchor,
      image: data.image?.trim() ?? "",
      imageAlt: data.imageAlt?.trim() ?? "",
      emphasis: data.emphasis ?? false,
      published: data.published,
      sortOrder: data.sortOrder ?? 0,
    }),
  );

export const deleteBusinessArea = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => DeleteBusinessAreaSchema.parse(data))
  .middleware([requireAdminAuth])
  .handler(async ({ data }) => {
    await removeBusinessArea(data.id);
    return { ok: true as const };
  });

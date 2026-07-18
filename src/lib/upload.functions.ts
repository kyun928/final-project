import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdminAuth } from "@/lib/admin-auth-middleware";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const BLOG_IMAGES_BUCKET = "blog-images";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const UploadAdminImageSchema = z.object({
  folder: z.enum(["blog", "business"]).default("blog"),
  fileName: z.string().trim().min(1).max(200),
  contentType: z.enum(ALLOWED_IMAGE_TYPES),
  base64: z.string().min(1),
});

function extensionForContentType(contentType: (typeof ALLOWED_IMAGE_TYPES)[number]) {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
  }
}

function sanitizeFileStem(fileName: string) {
  const stem = fileName.replace(/\.[^.]+$/, "").toLowerCase();
  const cleaned = stem.replace(/[^a-z0-9-_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return cleaned.slice(0, 48) || "image";
}

function decodeBase64(base64: string) {
  const normalized = base64.includes(",") ? (base64.split(",").pop() ?? "") : base64;

  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(normalized, "base64"));
  }

  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function uploadErrorMessage(error: { message: string }) {
  if (error.message.includes("Bucket not found") || error.message.toLowerCase().includes("bucket")) {
    return "이미지 저장소가 없습니다. 잠시 후 다시 시도하거나 supabase/blog_images_storage.sql 을 실행해 주세요.";
  }
  if (error.message.includes("mime type") || error.message.includes("content type")) {
    return "지원하지 않는 이미지 형식입니다. JPG, PNG, WEBP, GIF만 올릴 수 있습니다.";
  }
  if (error.message.includes("maximum allowed size") || error.message.includes("Payload too large")) {
    return "이미지 용량이 너무 큽니다. 5MB 이하 파일만 올릴 수 있습니다.";
  }
  return `이미지 업로드에 실패했습니다: ${error.message}`;
}

async function ensureBlogImagesBucket() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
  if (listError) {
    console.error("[storage] listBuckets:", listError.message);
    return;
  }

  if (buckets?.some((bucket) => bucket.name === BLOG_IMAGES_BUCKET)) {
    return;
  }

  const { error } = await supabaseAdmin.storage.createBucket(BLOG_IMAGES_BUCKET, {
    public: true,
    fileSizeLimit: MAX_IMAGE_BYTES,
    allowedMimeTypes: [...ALLOWED_IMAGE_TYPES],
  });

  if (error && !error.message.toLowerCase().includes("already exists")) {
    console.error("[storage] createBucket:", error.message);
    throw new Error(uploadErrorMessage(error));
  }
}

export const uploadAdminImage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => UploadAdminImageSchema.parse(data))
  .middleware([requireAdminAuth])
  .handler(async ({ data }) => {
    const bytes = decodeBase64(data.base64);

    if (bytes.byteLength === 0) {
      throw new Error("비어 있는 이미지 파일입니다.");
    }
    if (bytes.byteLength > MAX_IMAGE_BYTES) {
      throw new Error("이미지 용량이 너무 큽니다. 5MB 이하 파일만 올릴 수 있습니다.");
    }

    const supabaseAdmin = getSupabaseAdmin();
    await ensureBlogImagesBucket();

    const ext = extensionForContentType(data.contentType);
    const path = `${data.folder}/${Date.now()}-${sanitizeFileStem(data.fileName)}.${ext}`;

    let { error } = await supabaseAdmin.storage.from(BLOG_IMAGES_BUCKET).upload(path, bytes, {
      contentType: data.contentType,
      upsert: false,
      cacheControl: "3600",
    });

    if (error?.message.includes("Bucket not found")) {
      await ensureBlogImagesBucket();
      ({ error } = await supabaseAdmin.storage.from(BLOG_IMAGES_BUCKET).upload(path, bytes, {
        contentType: data.contentType,
        upsert: false,
        cacheControl: "3600",
      }));
    }

    if (error) {
      console.error("[storage] uploadAdminImage:", error.message);
      throw new Error(uploadErrorMessage(error));
    }

    const { data: publicData } = supabaseAdmin.storage.from(BLOG_IMAGES_BUCKET).getPublicUrl(path);

    return {
      path,
      url: publicData.publicUrl,
    };
  });

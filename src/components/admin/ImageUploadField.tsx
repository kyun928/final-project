import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  uploadAdminImage,
} from "@/lib/upload.functions";

type ImageUploadFieldProps = {
  imageUrl: string;
  imageAlt: string;
  onImageUrlChange: (url: string) => void;
  onImageAltChange: (alt: string) => void;
  folder?: "blog" | "business";
  disabled?: boolean;
};

function isAllowedImageType(type: string): type is (typeof ALLOWED_IMAGE_TYPES)[number] {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type);
}

async function fileToBase64(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("이미지를 읽지 못했습니다."));
    reader.readAsDataURL(file);
  });

  return dataUrl;
}

export function ImageUploadField({
  imageUrl,
  imageAlt,
  onImageUrlChange,
  onImageAltChange,
  folder = "blog",
  disabled = false,
}: ImageUploadFieldProps) {
  const uploadImage = useServerFn(uploadAdminImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!isAllowedImageType(file.type)) {
      setError("JPG, PNG, WEBP, GIF 이미지만 올릴 수 있습니다.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("이미지 용량은 5MB 이하여야 합니다.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const base64 = await fileToBase64(file);
      const result = await uploadImage({
        data: {
          folder,
          fileName: file.name,
          contentType: file.type,
          base64,
        },
      });
      onImageUrlChange(result.url);
      if (!imageAlt.trim()) {
        onImageAltChange(file.name.replace(/\.[^.]+$/, ""));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "이미지 업로드에 실패했습니다.";
      setError(
        message.includes("Unauthorized")
          ? "로그인이 만료되었습니다. 다시 로그인해 주세요."
          : message,
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>대표 이미지 (선택)</Label>
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {imageUrl ? (
            <div className="relative">
              <img
                src={imageUrl}
                alt={imageAlt || "대표 이미지 미리보기"}
                className="h-40 w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-black/55 to-transparent p-3">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={disabled || uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      업로드 중...
                    </>
                  ) : (
                    "이미지 변경"
                  )}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={disabled || uploading}
                  onClick={() => onImageUrlChange("")}
                >
                  <Trash2 className="size-4" />
                  제거
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex h-40 w-full flex-col items-center justify-center gap-2 px-4 text-center text-sm text-text-muted transition hover:bg-surface-blue/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 className="size-6 animate-spin text-primary" />
                  <span>업로드 중...</span>
                </>
              ) : (
                <>
                  <ImagePlus className="size-6 text-primary" />
                  <span className="font-medium text-text-strong">이미지 파일 선택</span>
                  <span className="text-xs">JPG, PNG, WEBP, GIF · 최대 5MB</span>
                </>
              )}
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          className="hidden"
          disabled={disabled || uploading}
          onChange={(event) => void handleFileChange(event)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="blog-image-url">또는 이미지 URL</Label>
          <Input
            id="blog-image-url"
            value={imageUrl}
            disabled={disabled || uploading}
            onChange={(event) => onImageUrlChange(event.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="blog-image-alt">이미지 설명 (선택)</Label>
          <Input
            id="blog-image-alt"
            value={imageAlt}
            disabled={disabled || uploading}
            onChange={(event) => onImageAltChange(event.target.value)}
            placeholder="이미지 대체 텍스트"
          />
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

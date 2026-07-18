import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { BusinessArea } from "@/data/business-areas";
import {
  deleteBusinessArea,
  fetchAdminBusinessAreas,
  saveBusinessArea,
  seedAdminBusinessAreas,
} from "@/lib/business-area.functions";

type FormState = {
  title: string;
  description: string;
  keywords: string;
  anchor: string;
  image: string;
  imageAlt: string;
  emphasis: boolean;
  published: boolean;
  sortOrder: string;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  keywords: "",
  anchor: "",
  image: "",
  imageAlt: "",
  emphasis: false,
  published: true,
  sortOrder: "0",
};

function toFormState(area: BusinessArea): FormState {
  return {
    title: area.title,
    description: area.description,
    keywords: area.keywords.join(", "),
    anchor: area.anchor,
    image: area.image,
    imageAlt: area.imageAlt,
    emphasis: area.emphasis,
    published: area.published,
    sortOrder: String(area.sortOrder),
  };
}

function formatSaveError(err: unknown) {
  if (!(err instanceof Error) || !err.message) {
    return "저장에 실패했습니다.";
  }
  if (err.message.includes("Unauthorized")) {
    return "로그인이 만료되었습니다. 다시 로그인해 주세요.";
  }

  const trimmed = err.message.trim();
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as Array<{ message?: string }>;
      const first = parsed.find((item) => item.message)?.message;
      if (first) return first;
    } catch {
      // fall through
    }
  }

  return err.message;
}

export function BusinessAreasPanel() {
  const loadAreas = useServerFn(fetchAdminBusinessAreas);
  const saveArea = useServerFn(saveBusinessArea);
  const removeArea = useServerFn(deleteBusinessArea);
  const seedAreas = useServerFn(seedAdminBusinessAreas);

  const [areas, setAreas] = useState<BusinessArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await loadAreas();
      setAreas(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "사업영역을 불러오지 못했습니다.";
      setLoadError(
        message.includes("Unauthorized")
          ? "로그인이 만료되었습니다. 다시 로그인해 주세요."
          : message,
      );
    } finally {
      setLoading(false);
    }
  }, [loadAreas]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function openCreateDialog() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setDialogOpen(true);
  }

  function openEditDialog(area: BusinessArea) {
    setEditingId(area.id.startsWith("static-") ? null : area.id);
    setForm(toFormState(area));
    setError("");
    setDialogOpen(true);
  }

  async function handleSeed() {
    setSaving(true);
    setLoadError("");
    try {
      const data = await seedAreas();
      setAreas(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "기본 데이터 등록에 실패했습니다.";
      setLoadError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }
    if (!form.description.trim()) {
      setError("설명을 입력해 주세요.");
      return;
    }
    if (!form.anchor.trim()) {
      setError("앵커(영문 id)를 입력해 주세요.");
      return;
    }
    const normalizedAnchor = form.anchor
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (!normalizedAnchor) {
      setError("앵커 id는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다. 예: first-business");
      return;
    }

    const sortOrder = Number.parseInt(form.sortOrder, 10);
    if (Number.isNaN(sortOrder) || sortOrder < 0) {
      setError("정렬 순서는 0 이상의 숫자여야 합니다.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const saved = await saveArea({
        data: {
          id: editingId ?? undefined,
          title: form.title.trim(),
          description: form.description.trim(),
          keywords: form.keywords
            .split(/[,，\n]/)
            .map((item) => item.trim())
            .filter(Boolean),
          anchor: normalizedAnchor,
          image: form.image.trim(),
          imageAlt: form.imageAlt.trim(),
          emphasis: form.emphasis,
          published: form.published,
          sortOrder,
        },
      });

      setAreas((prev) => {
        const withoutStatic = prev.filter((item) => !item.id.startsWith("static-"));
        const index = withoutStatic.findIndex((item) => item.id === saved.id);
        if (index >= 0) {
          const next = [...withoutStatic];
          next[index] = saved;
          return next.sort((a, b) => a.sortOrder - b.sortOrder);
        }
        return [...withoutStatic, saved].sort((a, b) => a.sortOrder - b.sortOrder);
      });

      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      setError(formatSaveError(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (id.startsWith("static-")) {
      setLoadError("기본 샘플은 삭제 대신 수정 저장하면 됩니다.");
      return;
    }
    if (!window.confirm("이 사업영역을 삭제하시겠습니까?")) return;

    try {
      await removeArea({ data: { id } });
      setAreas((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "삭제에 실패했습니다.";
      setLoadError(message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-text-strong">사업영역 관리</h3>
          <p className="text-sm text-text-muted">
            등록한 내용은 Supabase에 저장되고 `/business` 페이지에 반영됩니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void handleSeed()} disabled={saving || loading}>
            기본 데이터 등록
          </Button>
          <Button className="gap-2" onClick={openCreateDialog}>
            <Plus className="size-4" />
            새 사업영역
          </Button>
        </div>
      </div>

      {loadError ? <p className="text-sm text-destructive">{loadError}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">등록된 사업영역</CardTitle>
          <CardDescription>게시 중인 항목만 웹사이트에 표시됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead className="hidden sm:table-cell">앵커</TableHead>
                <TableHead className="hidden md:table-cell">순서</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-text-muted">
                    불러오는 중...
                  </TableCell>
                </TableRow>
              ) : areas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-text-muted">
                    등록된 사업영역이 없습니다. 「기본 데이터 등록」을 눌러 시작할 수 있습니다.
                  </TableCell>
                </TableRow>
              ) : (
                areas.map((area) => (
                  <TableRow key={area.id}>
                    <TableCell className="max-w-[220px] truncate font-medium">
                      {area.emphasis ? "[강조] " : ""}
                      {area.title}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{area.anchor}</TableCell>
                    <TableCell className="hidden md:table-cell">{area.sortOrder}</TableCell>
                    <TableCell>
                      <Badge variant={area.published ? "default" : "secondary"}>
                        {area.published ? "게시중" : "비공개"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(area)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => void handleDelete(area.id)}
                          disabled={area.id.startsWith("static-")}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "사업영역 수정" : "새 사업영역 등록"}</DialogTitle>
            <DialogDescription>
              제목, 설명, 키워드, 앵커를 입력하고 게시 여부를 선택하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="ba-title">제목</Label>
              <Input
                id="ba-title"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="데이터 분석"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ba-description">설명</Label>
              <Textarea
                id="ba-description"
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ba-keywords">키워드 (쉼표로 구분)</Label>
              <Input
                id="ba-keywords"
                value={form.keywords}
                onChange={(event) => setForm((prev) => ({ ...prev, keywords: event.target.value }))}
                placeholder="통계 분석, 대시보드"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ba-anchor">앵커 id</Label>
                <Input
                  id="ba-anchor"
                  value={form.anchor}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      anchor: event.target.value.toLowerCase().replace(/\s+/g, "-"),
                    }))
                  }
                  placeholder="data-analytics"
                />
                <p className="text-xs text-text-muted">
                  영문 소문자, 숫자, 하이픈만 사용 (예: first-business)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ba-sort">정렬 순서</Label>
                <Input
                  id="ba-sort"
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
                />
              </div>
            </div>

            <ImageUploadField
              folder="business"
              imageUrl={form.image}
              imageAlt={form.imageAlt}
              disabled={saving}
              onImageUrlChange={(image) => setForm((prev) => ({ ...prev, image }))}
              onImageAltChange={(imageAlt) => setForm((prev) => ({ ...prev, imageAlt }))}
            />

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ba-emphasis"
                  checked={form.emphasis}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, emphasis: checked === true }))
                  }
                />
                <Label htmlFor="ba-emphasis" className="cursor-pointer">
                  강조 카드
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ba-published"
                  checked={form.published}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, published: checked === true }))
                  }
                />
                <Label htmlFor="ba-published" className="cursor-pointer">
                  웹사이트에 게시
                </Label>
              </div>
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              취소
            </Button>
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving ? "저장 중..." : editingId ? "수정 저장" : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

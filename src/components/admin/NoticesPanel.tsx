import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { noticeCategories, type Notice } from "@/data/notices";
import { fetchAdminNotices, removeNotice, saveNotice } from "@/lib/notice.functions";

type NoticeFormState = {
  title: string;
  category: string;
  summary: string;
  image: string;
  imageAlt: string;
  content: string;
  pinned: boolean;
  published: boolean;
  author: string;
};

const emptyForm: NoticeFormState = {
  title: "",
  category: noticeCategories[0],
  summary: "",
  image: "",
  imageAlt: "",
  content: "",
  pinned: false,
  published: true,
  author: "관리자",
};

function toFormState(notice: Notice): NoticeFormState {
  return {
    title: notice.title,
    category: notice.category,
    summary: notice.summary ?? "",
    image: notice.image,
    imageAlt: notice.imageAlt,
    content: notice.content.join("\n\n"),
    pinned: notice.pinned ?? false,
    published: notice.published ?? true,
    author: notice.author ?? "관리자",
  };
}

export function NoticesPanel() {
  const loadNotices = useServerFn(fetchAdminNotices);
  const saveNoticeFn = useServerFn(saveNotice);
  const deleteNoticeFn = useServerFn(removeNotice);

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NoticeFormState>(emptyForm);
  const [error, setError] = useState("");

  const refreshNotices = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await loadNotices();
      setNotices(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "공지사항을 불러오지 못했습니다.";
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  }, [loadNotices]);

  useEffect(() => {
    void refreshNotices();
  }, [refreshNotices]);

  function openCreateDialog() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setDialogOpen(true);
  }

  function openEditDialog(notice: Notice) {
    setEditingId(notice.id);
    setForm(toFormState(notice));
    setError("");
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }
    if (!form.content.trim()) {
      setError("본문을 입력해 주세요.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const content = form.content
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    setSaving(true);
    setError("");

    try {
      const saved = await saveNoticeFn({
        data: {
          id: editingId ?? undefined,
          title: form.title.trim(),
          category: form.category,
          summary: form.summary.trim(),
          image: form.image.trim(),
          imageAlt: form.imageAlt.trim(),
          content,
          pinned: form.pinned,
          published: form.published,
          author: form.author.trim() || "관리자",
          date: editingId ? (notices.find((item) => item.id === editingId)?.date ?? today) : today,
        },
      });

      setNotices((prev) => {
        const index = prev.findIndex((item) => item.id === saved.id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = saved;
          return next;
        }
        return [saved, ...prev];
      });

      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      const message = err instanceof Error ? err.message : "저장에 실패했습니다.";
      setError(message.includes("Unauthorized") ? "로그인이 만료되었습니다. 다시 로그인해 주세요." : message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("이 공지사항을 삭제하시겠습니까?")) return;

    try {
      await deleteNoticeFn({ data: { id } });
      setNotices((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "삭제에 실패했습니다.";
      setLoadError(message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-text-strong">공지사항 관리</h3>
          <p className="text-sm text-text-muted">
            공지사항을 작성하면 Supabase에 저장되고 웹사이트에 노출됩니다.
          </p>
        </div>
        <Button className="gap-2" onClick={openCreateDialog}>
          <Plus className="size-4" />
          새 공지 작성
        </Button>
      </div>

      {loadError ? <p className="text-sm text-destructive">{loadError}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">등록된 공지사항</CardTitle>
          <CardDescription>게시 중인 공지만 웹사이트에 표시됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead className="hidden sm:table-cell">작성자</TableHead>
                <TableHead className="hidden md:table-cell">등록일</TableHead>
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
              ) : notices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-text-muted">
                    등록된 공지가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                notices.map((notice) => (
                  <TableRow key={notice.id}>
                    <TableCell className="max-w-[240px] truncate font-medium">
                      {notice.pinned ? "[고정] " : ""}
                      {notice.title}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{notice.author}</TableCell>
                    <TableCell className="hidden md:table-cell">{notice.date}</TableCell>
                    <TableCell>
                      <Badge variant={notice.published ? "default" : "secondary"}>
                        {notice.published ? "게시중" : "임시저장"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(notice)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(notice.id)}>
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
            <DialogTitle>{editingId ? "공지사항 수정" : "새 공지사항 작성"}</DialogTitle>
            <DialogDescription>제목, 본문을 입력하고 게시 여부를 선택하세요.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="notice-title">제목</Label>
              <Input
                id="notice-title"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="공지 제목"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="notice-category">분류</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger id="notice-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {noticeCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notice-author">작성자</Label>
                <Input
                  id="notice-author"
                  value={form.author}
                  onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notice-summary">요약 (선택)</Label>
              <Textarea
                id="notice-summary"
                value={form.summary}
                onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
                placeholder="비우면 제목이 요약으로 사용됩니다"
                rows={2}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="notice-image">대표 이미지 URL (선택)</Label>
                <Input
                  id="notice-image"
                  value={form.image}
                  onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notice-image-alt">이미지 설명 (선택)</Label>
                <Input
                  id="notice-image-alt"
                  value={form.imageAlt}
                  onChange={(event) => setForm((prev) => ({ ...prev, imageAlt: event.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notice-content">본문</Label>
              <Textarea
                id="notice-content"
                value={form.content}
                onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
                placeholder="문단마다 빈 줄로 구분해 입력하세요."
                rows={8}
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="notice-pinned"
                  checked={form.pinned}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, pinned: checked === true }))
                  }
                />
                <Label htmlFor="notice-pinned" className="cursor-pointer">
                  상단 고정
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="notice-published"
                  checked={form.published}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, published: checked === true }))
                  }
                />
                <Label htmlFor="notice-published" className="cursor-pointer">
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
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "저장 중..." : editingId ? "수정 저장" : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

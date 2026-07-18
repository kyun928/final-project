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
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { blogCategories, type BlogPost } from "@/data/blogs";
import { fetchAdminBlogs, removeBlogPost, saveBlogPost } from "@/lib/blog.functions";

type BlogFormState = {
  title: string;
  category: string;
  summary: string;
  image: string;
  imageAlt: string;
  content: string;
  published: boolean;
};

const emptyForm: BlogFormState = {
  title: "",
  category: blogCategories[0],
  summary: "",
  image: "",
  imageAlt: "",
  content: "",
  published: true,
};

function toFormState(post: BlogPost): BlogFormState {
  return {
    title: post.title,
    category: post.category,
    summary: post.summary,
    image: post.image,
    imageAlt: post.imageAlt,
    content: post.content.join("\n\n"),
    published: post.published,
  };
}

export function BlogsPanel() {
  const loadBlogs = useServerFn(fetchAdminBlogs);
  const saveBlog = useServerFn(saveBlogPost);
  const deleteBlogFn = useServerFn(removeBlogPost);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogFormState>(emptyForm);
  const [error, setError] = useState("");

  const refreshPosts = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await loadBlogs();
      setPosts(data);
    } catch {
      setLoadError("블로그 글을 불러오지 못했습니다. 로그인 상태와 Supabase 설정을 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  }, [loadBlogs]);

  useEffect(() => {
    void refreshPosts();
  }, [refreshPosts]);

  function openCreateDialog() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setDialogOpen(true);
  }

  function openEditDialog(post: BlogPost) {
    setEditingId(post.id);
    setForm(toFormState(post));
    setError("");
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }
    if (!form.summary.trim()) {
      setError("요약을 입력해 주세요.");
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
      const saved = await saveBlog({
        data: {
          id: editingId ?? undefined,
          title: form.title.trim(),
          category: form.category,
          summary: form.summary.trim(),
          image: form.image.trim(),
          imageAlt: form.imageAlt.trim(),
          content,
          published: form.published,
          date: editingId ? (posts.find((item) => item.id === editingId)?.date ?? today) : today,
        },
      });

      setPosts((prev) => {
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
    if (!window.confirm("이 블로그 글을 삭제하시겠습니까?")) return;

    try {
      await deleteBlogFn({ data: { id } });
      setPosts((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setLoadError("삭제에 실패했습니다.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-text-strong">블로그 관리</h3>
          <p className="text-sm text-text-muted">
            블로그 글을 작성하면 Supabase에 저장되고 웹사이트 블로그 페이지에 노출됩니다.
          </p>
        </div>
        <Button className="gap-2" onClick={openCreateDialog}>
          <Plus className="size-4" />
          새 글 작성
        </Button>
      </div>

      {loadError ? <p className="text-sm text-destructive">{loadError}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">등록된 블로그 글</CardTitle>
          <CardDescription>게시 중인 글만 웹사이트에 표시됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead className="hidden sm:table-cell">분류</TableHead>
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
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-text-muted">
                    등록된 글이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="max-w-[240px] truncate font-medium">{post.title}</TableCell>
                    <TableCell className="hidden sm:table-cell">{post.category}</TableCell>
                    <TableCell className="hidden md:table-cell">{post.date}</TableCell>
                    <TableCell>
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "게시중" : "임시저장"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(post)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
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
            <DialogTitle>{editingId ? "블로그 글 수정" : "새 블로그 글 작성"}</DialogTitle>
            <DialogDescription>제목, 요약, 본문을 입력하고 게시 여부를 선택하세요.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="blog-title">제목</Label>
              <Input
                id="blog-title"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="블로그 글 제목"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-category">분류</Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="blog-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {blogCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-summary">요약</Label>
              <Textarea
                id="blog-summary"
                value={form.summary}
                onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
                placeholder="목록에 표시될 짧은 요약"
                rows={2}
              />
            </div>

            <ImageUploadField
              imageUrl={form.image}
              imageAlt={form.imageAlt}
              disabled={saving}
              onImageUrlChange={(image) => setForm((prev) => ({ ...prev, image }))}
              onImageAltChange={(imageAlt) => setForm((prev) => ({ ...prev, imageAlt }))}
            />

            <div className="space-y-2">
              <Label htmlFor="blog-content">본문</Label>
              <Textarea
                id="blog-content"
                value={form.content}
                onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
                placeholder="문단마다 빈 줄로 구분해 입력하세요."
                rows={8}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="blog-published"
                checked={form.published}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, published: checked === true }))
                }
              />
              <Label htmlFor="blog-published" className="cursor-pointer">
                웹사이트에 게시
              </Label>
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

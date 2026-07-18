import { useCallback, useEffect, useMemo, useState } from "react";
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
import { formatInquiryDate, type Inquiry } from "@/data/inquiries";
import { fetchAdminInquiries, updateInquiryReply } from "@/lib/inquiry.functions";

export function InquiriesPanel() {
  const loadInquiries = useServerFn(fetchAdminInquiries);
  const saveReply = useServerFn(updateInquiryReply);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [replied, setReplied] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [error, setError] = useState("");

  const unansweredCount = useMemo(
    () => inquiries.filter((item) => !item.replied).length,
    [inquiries],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await loadInquiries();
      setInquiries(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "문의를 불러오지 못했습니다.";
      setLoadError(
        message.includes("Unauthorized")
          ? "로그인이 만료되었습니다. 다시 로그인해 주세요."
          : message,
      );
    } finally {
      setLoading(false);
    }
  }, [loadInquiries]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function openDetail(inquiry: Inquiry) {
    setSelected(inquiry);
    setReplied(inquiry.replied);
    setAdminNote(inquiry.adminNote);
    setError("");
    setDialogOpen(true);
  }

  async function handleSaveReply() {
    if (!selected) return;

    setSaving(true);
    setError("");

    try {
      const updated = await saveReply({
        data: {
          id: selected.id,
          replied,
          adminNote,
        },
      });

      setInquiries((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSelected(updated);
      setDialogOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "저장에 실패했습니다.";
      setError(
        message.includes("Unauthorized")
          ? "로그인이 만료되었습니다. 다시 로그인해 주세요."
          : message,
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-text-strong">문의사항 관리</h3>
          <p className="text-sm text-text-muted">
            홈페이지에서 접수된 문의를 확인하고 회신 여부를 업데이트합니다.
          </p>
        </div>
        <p className="text-sm text-text-muted">
          미답변 <span className="font-semibold text-primary">{unansweredCount}</span>건
        </p>
      </div>

      {loadError ? <p className="text-sm text-destructive">{loadError}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">접수된 문의</CardTitle>
          <CardDescription>최신 접수순으로 표시됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead className="hidden sm:table-cell">회사명</TableHead>
                <TableHead className="hidden md:table-cell">문의 분야</TableHead>
                <TableHead className="hidden lg:table-cell">접수일</TableHead>
                <TableHead>답변</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-text-muted">
                    불러오는 중...
                  </TableCell>
                </TableRow>
              ) : inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-text-muted">
                    접수된 문의가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{inquiry.company}</TableCell>
                    <TableCell className="hidden md:table-cell">{inquiry.category}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatInquiryDate(inquiry.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={inquiry.replied ? "default" : "secondary"}>
                        {inquiry.replied ? "답변완료" : "미답변"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openDetail(inquiry)}>
                        상세
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>문의 상세</DialogTitle>
            <DialogDescription>
              문의 내용을 확인하고 회신 완료 여부를 업데이트하세요.
            </DialogDescription>
          </DialogHeader>

          {selected ? (
            <div className="space-y-4 py-2">
              <div className="grid gap-3 rounded-xl bg-surface px-4 py-3 text-sm sm:grid-cols-2">
                <InfoItem label="이름" value={selected.name} />
                <InfoItem label="회사명" value={selected.company} />
                <InfoItem label="연락처" value={selected.phone} />
                <InfoItem label="이메일" value={selected.email} />
                <InfoItem label="문의 분야" value={selected.category} />
                <InfoItem label="접수일" value={formatInquiryDate(selected.createdAt)} />
                <InfoItem label="예산" value={selected.budget || "-"} />
                <InfoItem label="일정" value={selected.schedule || "-"} />
              </div>

              <div className="space-y-2">
                <Label>문의 내용</Label>
                <p className="whitespace-pre-wrap rounded-xl border border-border bg-white px-4 py-3 text-sm leading-relaxed text-text-strong">
                  {selected.message}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-3">
                <Checkbox
                  id="inquiry-replied"
                  checked={replied}
                  onCheckedChange={(checked) => setReplied(checked === true)}
                />
                <Label htmlFor="inquiry-replied" className="cursor-pointer">
                  회신 완료로 표시
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inquiry-admin-note">관리자 메모 (선택)</Label>
                <Textarea
                  id="inquiry-admin-note"
                  value={adminNote}
                  onChange={(event) => setAdminNote(event.target.value)}
                  placeholder="전화/이메일 회신 내용, 후속 조치 등을 메모하세요."
                  rows={3}
                />
              </div>

              {selected.repliedAt ? (
                <p className="text-xs text-text-muted">
                  최근 회신 처리: {formatInquiryDate(selected.repliedAt)}
                </p>
              ) : null}

              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              닫기
            </Button>
            <Button onClick={() => void handleSaveReply()} disabled={saving || !selected}>
              {saving ? "저장 중..." : "상태 저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-0.5 font-medium text-text-strong">{value}</p>
    </div>
  );
}

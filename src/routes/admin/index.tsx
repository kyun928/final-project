import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, BookOpen, Briefcase, MessageSquareText } from "lucide-react";
import { z } from "zod";

import { AdminShell } from "@/components/admin/AdminShell";
import { BlogsPanel } from "@/components/admin/BlogsPanel";
import { BusinessAreasPanel } from "@/components/admin/BusinessAreasPanel";
import { InquiriesPanel } from "@/components/admin/InquiriesPanel";
import { NoticesPanel } from "@/components/admin/NoticesPanel";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const adminSearchSchema = z.object({
  tab: z.enum(["notices", "blogs", "business", "inquiries"]).optional(),
});

export const Route = createFileRoute("/admin/")({
  validateSearch: adminSearchSchema,
  head: () => ({
    meta: [{ title: "관리자 대시보드 | 와이즈인컴퍼니" }],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { tab } = Route.useSearch();
  const activeTab = tab ?? "overview";

  const titles = {
    overview: {
      title: "대시보드",
      description: "공지사항, 블로그, 사업영역, 문의사항을 한곳에서 관리합니다.",
    },
    notices: {
      title: "공지사항",
      description: "웹사이트에 노출될 공지사항을 관리합니다.",
    },
    blogs: {
      title: "블로그",
      description: "웹사이트 블로그에 게시할 글을 작성·관리합니다.",
    },
    business: {
      title: "사업영역",
      description: "사업영역 카드 내용을 등록·수정합니다.",
    },
    inquiries: {
      title: "문의사항",
      description: "방문자 문의 내역과 답변 상태를 관리합니다.",
    },
  } as const;

  const { title, description } = titles[activeTab];

  return (
    <RequireAdmin>
      <AdminShell title={title} description={description} activeTab={activeTab}>
        <Tabs value={activeTab} className="space-y-6">
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="overview" asChild>
              <Link to="/admin">개요</Link>
            </TabsTrigger>
            <TabsTrigger value="notices" asChild>
              <Link to="/admin" search={{ tab: "notices" }}>
                공지사항
              </Link>
            </TabsTrigger>
            <TabsTrigger value="blogs" asChild>
              <Link to="/admin" search={{ tab: "blogs" }}>
                블로그
              </Link>
            </TabsTrigger>
            <TabsTrigger value="business" asChild>
              <Link to="/admin" search={{ tab: "business" }}>
                사업영역
              </Link>
            </TabsTrigger>
            <TabsTrigger value="inquiries" asChild>
              <Link to="/admin" search={{ tab: "inquiries" }}>
                문의사항
              </Link>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-text-muted">공지사항</CardTitle>
                  <Bell className="size-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-text-muted">공지사항 탭에서 관리</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-text-muted">블로그</CardTitle>
                  <BookOpen className="size-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-text-muted">블로그 탭에서 관리</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-text-muted">사업영역</CardTitle>
                  <Briefcase className="size-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-text-muted">사업영역 탭에서 관리</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-text-muted">문의사항</CardTitle>
                  <MessageSquareText className="size-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-text-muted">문의 접수·회신 상태 관리</p>
                </CardContent>
              </Card>
            </div>

            <BusinessAreasPanel />
          </TabsContent>

          <TabsContent value="notices">
            <NoticesPanel />
          </TabsContent>

          <TabsContent value="blogs">
            <BlogsPanel />
          </TabsContent>

          <TabsContent value="business">
            <BusinessAreasPanel />
          </TabsContent>

          <TabsContent value="inquiries">
            <InquiriesPanel />
          </TabsContent>
        </Tabs>
      </AdminShell>
    </RequireAdmin>
  );
}

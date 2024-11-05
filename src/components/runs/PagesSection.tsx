import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Page } from "@/integrations/supabase/types/pages";
import { PageTable } from "@/components/pages/PageTable";
import { PageCards } from "@/components/pages/PageCards";

interface PagesSectionProps {
  pages: Page[];
  pageCounts: {
    queued: number;
    completed: number;
    failed: number;
    total: number;
  } | null;
}

export const PagesSection = ({ pages, pageCounts }: PagesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Tabs defaultValue="cards">
            <TabsList>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-4 text-sm">
            <div>Queued: {pageCounts?.queued || 0}</div>
            <div>Complete: {pageCounts?.completed || 0}</div>
            {(pageCounts?.failed || 0) > 0 && (
              <div className="text-red-500">Failed: {pageCounts?.failed}</div>
            )}
            <div>Total: {pageCounts?.total || 0}</div>
          </div>
        </div>
        <Tabs defaultValue="cards">
          <TabsContent value="cards">
            <PageCards pages={pages} />
          </TabsContent>
          <TabsContent value="table">
            <PageTable pages={pages} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
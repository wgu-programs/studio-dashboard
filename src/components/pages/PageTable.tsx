import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Page {
  page_id: string;
  url: string;
  title: string | null;
  description: string | null;
  status: string | null;
  snapshot_url: string | null;
  run_id: string;
}

interface PageTableProps {
  pages: Page[];
}

export const PageTable = ({ pages }: PageTableProps) => {
  const navigate = useNavigate();

  // Get the run_id from the first page (assuming all pages belong to the same run)
  const runId = pages[0]?.run_id;

  // Fetch page counts for the run
  const { data: pageCounts } = useQuery({
    queryKey: ['runPageCounts', runId],
    queryFn: async () => {
      if (!runId) return null;
      
      const { data, error } = await supabase
        .from('pages')
        .select('status')
        .eq('run_id', runId);

      if (error) throw error;

      const counts = {
        completed: data.filter(page => page.status === 'completed').length,
        queued: data.filter(page => page.status === 'queued').length,
        failed: data.filter(page => page.status === 'failed').length,
        total: data.length
      };

      // If all pages are completed, update the run status
      if (counts.completed === counts.total && counts.total > 0) {
        const { error: updateError } = await supabase
          .from('runs')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('run_id', runId);

        if (updateError) {
          console.error('Error updating run status:', updateError);
        }
      }

      return counts;
    },
    enabled: !!runId,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pages</CardTitle>
        <div className="flex gap-4 text-sm">
          <div>Queued: {pageCounts?.queued || 0}</div>
          <div>Complete: {pageCounts?.completed || 0}</div>
          {(pageCounts?.failed || 0) > 0 && (
            <div className="text-red-500">Failed: {pageCounts?.failed}</div>
          )}
          <div>Total: {pageCounts?.total || 0}</div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow 
                key={page.page_id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/pages/${page.page_id}`)}
              >
                <TableCell className="font-medium">{page.title || "Untitled"}</TableCell>
                <TableCell>{page.url}</TableCell>
                <TableCell>{page.status}</TableCell>
                <TableCell className="max-w-md truncate">
                  {page.description || "No description"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
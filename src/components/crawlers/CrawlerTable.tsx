import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Play as PlayIcon } from "lucide-react";
import { generateRunName } from "@/utils/nameGenerator";

interface CrawlerTableProps {
  crawlers: any[];
  showArchived: boolean;
  onRunStatusChange: () => void;
}

export const CrawlerTable = ({ crawlers, showArchived, onRunStatusChange }: CrawlerTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartCrawler = async (crawler: any) => {
    try {
      const { error } = await supabase
        .from("runs")
        .insert([
          {
            crawler_id: crawler.crawler_id,
            status: "queued",
            started_at: new Date().toISOString(),
            name: generateRunName(),
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Crawler started successfully",
      });

      onRunStatusChange();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start crawler",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Latest Run</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {crawlers.map((crawler) => {
            const latestRun = crawler.runs
              ?.filter((run: any) => showArchived || !run.archived)
              ?.sort((a: any, b: any) => 
                new Date(b.started_at || 0).getTime() - new Date(a.started_at || 0).getTime()
              )[0];

            return (
              <TableRow 
                key={crawler.crawler_id}
                className="cursor-pointer"
                onClick={() => navigate(`/crawlers/${crawler.crawler_id}`)}
              >
                <TableCell className="font-medium">
                  {crawler.name || "Unnamed Crawler"}
                </TableCell>
                <TableCell>
                  {crawler.project?.name || "No project"}
                </TableCell>
                <TableCell>{crawler.description || "No description"}</TableCell>
                <TableCell>{crawler.status}</TableCell>
                <TableCell>
                  {latestRun ? (
                    <div className="space-y-1">
                      <div>Status: {latestRun.status}</div>
                      <div className="text-sm text-muted-foreground">
                        Started: {formatDistanceToNow(new Date(latestRun.started_at), { addSuffix: true })}
                      </div>
                    </div>
                  ) : (
                    "No runs"
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartCrawler(crawler)}
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Start Run
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {crawlers.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No crawlers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
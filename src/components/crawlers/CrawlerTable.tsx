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
import { Pause, Play, Square, Archive, Play as PlayIcon } from "lucide-react";
import { generateRunName } from "@/utils/nameGenerator";

interface CrawlerTableProps {
  crawlers: any[];
  showArchived: boolean;
  onRunStatusChange: () => void;
}

export const CrawlerTable = ({ crawlers, showArchived, onRunStatusChange }: CrawlerTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRunAction = async (runId: string, action: 'pause' | 'stop') => {
    try {
      const updates = {
        status: action === 'pause' ? 'paused' : 'stopped',
        ...(action === 'stop' ? { completed_at: new Date().toISOString() } : {}),
      };

      const { error } = await supabase
        .from('runs')
        .update(updates)
        .eq('run_id', runId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Run ${action}ed successfully`,
      });

      onRunStatusChange();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} run`,
        variant: "destructive",
      });
    }
  };

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
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleStartCrawler(crawler)}
                    >
                      <PlayIcon className="h-4 w-4" />
                    </Button>
                    {latestRun && latestRun.status !== 'stopped' && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRunAction(latestRun.run_id, 'pause')}
                        >
                          {latestRun.status === 'paused' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRunAction(latestRun.run_id, 'stop')}
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
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

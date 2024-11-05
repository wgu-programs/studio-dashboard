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

  const handleStartCrawler = async (crawler: any, e: React.MouseEvent) => {
    e.stopPropagation();
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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {crawlers.map((crawler) => (
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
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleStartCrawler(crawler, e)}
                >
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Start Run
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {crawlers.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No crawlers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
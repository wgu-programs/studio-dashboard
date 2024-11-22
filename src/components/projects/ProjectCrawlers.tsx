import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { NewProjectCrawlerDialog } from "./NewProjectCrawlerDialog";
import { Crawler } from "@/integrations/supabase/types";

interface ProjectCrawlersProps {
  projectId: string;
}

export const ProjectCrawlers = ({ projectId }: ProjectCrawlersProps) => {
  const [crawlers, setCrawlers] = useState<Crawler[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchCrawlers = async () => {
    const { data, error } = await supabase
      .from("crawler")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch crawlers",
        variant: "destructive",
      });
      return;
    }

    // Ensure status is set for each crawler
    const crawlersWithStatus = (data || []).map(crawler => ({
      ...crawler,
      status: crawler.status || 'unknown'
    }));

    setCrawlers(crawlersWithStatus);
  };

  useEffect(() => {
    fetchCrawlers();
  }, [projectId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Crawlers</h2>
        <NewProjectCrawlerDialog projectId={projectId} onCrawlerCreated={fetchCrawlers} />
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crawlers.map((crawler) => (
              <TableRow 
                key={crawler.crawler_id}
                className="cursor-pointer"
                onClick={() => navigate(`/crawlers/${crawler.crawler_id}`)}
              >
                <TableCell className="font-medium">{crawler.name || "Unnamed Crawler"}</TableCell>
                <TableCell>{crawler.status}</TableCell>
                <TableCell>
                  {crawler.created_at
                    ? formatDistanceToNow(new Date(crawler.created_at), { addSuffix: true })
                    : "Unknown"}
                </TableCell>
              </TableRow>
            ))}
            {crawlers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No crawlers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
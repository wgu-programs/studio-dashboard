import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateRunName } from "@/utils/nameGenerator";
import { Json } from "@/integrations/supabase/types/json";

interface RunCrawlerButtonProps {
  crawlerId: string;
  startUrls: Json | null;
  onRunCreated: () => void;
}

export const RunCrawlerButton = ({ crawlerId, startUrls, onRunCreated }: RunCrawlerButtonProps) => {
  const { toast } = useToast();

  const handleRunCrawler = async () => {
    try {
      // First get the crawler details to get project_id and workspace_id
      const { data: crawlerData, error: crawlerError } = await supabase
        .from("crawler")
        .select(`
          project_id,
          workspace_id,
          projects (
            workspace_id
          )
        `)
        .eq("crawler_id", crawlerId)
        .single();

      if (crawlerError) throw crawlerError;

      // Get the workspace_id either directly from crawler or from its project
      const workspace_id = crawlerData.workspace_id || crawlerData.projects?.workspace_id;

      // Create the run
      const { data: runData, error: runError } = await supabase
        .from("runs")
        .insert([
          {
            crawler_id: crawlerId,
            project_id: crawlerData.project_id,
            workspace_id: workspace_id,
            status: "queued",
            started_at: new Date().toISOString(),
            name: generateRunName(),
          },
        ])
        .select()
        .single();

      if (runError) throw runError;

      // Then add all start URLs as pages
      if (Array.isArray(startUrls) && startUrls.length > 0) {
        const pages = startUrls.map((url: string) => ({
          url,
          crawler_id: crawlerId,
          run_id: runData.run_id,
          project_id: crawlerData.project_id,
          workspace_id: workspace_id,
          status: "queued",
        }));

        const { error: pagesError } = await supabase
          .from("pages")
          .insert(pages);

        if (pagesError) throw pagesError;
      } else {
        toast({
          title: "Notice",
          description: "No start URLs configured for this crawler",
          variant: "default",
        });
      }

      toast({
        title: "Success",
        description: "Crawler started successfully",
      });
      
      onRunCreated();
    } catch (error: any) {
      console.error('Error starting crawler:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start crawler",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleRunCrawler}>Run Crawler</Button>
  );
};
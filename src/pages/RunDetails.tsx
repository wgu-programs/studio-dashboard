import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Run } from "@/integrations/supabase/types/runs";
import { Crawler } from "@/integrations/supabase/types/crawler";
import { Page } from "@/integrations/supabase/types/pages";
import { useQuery } from "@tanstack/react-query";
import { RunControls } from "@/components/runs/RunControls";
import { RunDetailsCard } from "@/components/runs/RunDetailsCard";
import { CrawlerInfoCard } from "@/components/runs/CrawlerInfoCard";
import { PagesSection } from "@/components/runs/PagesSection";

interface RunWithCrawler extends Run {
  crawler: Partial<Crawler> | null;
}

const RunDetails = () => {
  const { runId } = useParams();
  const [run, setRun] = useState<RunWithCrawler | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  const { data: pageCounts } = useQuery({
    queryKey: ['runPageCounts', runId],
    queryFn: async () => {
      if (!runId) return null;
      
      const { data, error } = await supabase
        .from('pages')
        .select('status')
        .eq('run_id', runId);

      if (error) throw error;

      return {
        completed: data.filter(page => page.status === 'completed').length,
        queued: data.filter(page => page.status === 'queued').length,
        failed: data.filter(page => page.status === 'failed').length,
        total: data.length
      };
    },
    enabled: !!runId,
  });

  const fetchRun = async () => {
    try {
      const { data, error } = await supabase
        .from("runs")
        .select(`
          *,
          crawler (
            crawler_id,
            name,
            description,
            status
          )
        `)
        .eq("run_id", runId)
        .single();

      if (error) throw error;
      setRun(data);

      const { data: pagesData, error: pagesError } = await supabase
        .from("pages")
        .select("*")
        .eq("run_id", runId);

      if (pagesError) throw pagesError;
      setPages(pagesData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch run details",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (runId) {
      fetchRun();
    }
  }, [runId]);

  if (!run) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle>{run.name || "Unnamed Run"}</PageTitle>
        <RunControls runId={run.run_id} status={run.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RunDetailsCard run={run} />
        <CrawlerInfoCard crawler={run.crawler} />
      </div>

      <PagesSection pages={pages} pageCounts={pageCounts} />
    </div>
  );
};

export default RunDetails;
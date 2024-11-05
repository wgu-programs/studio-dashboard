import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RunDetailsCard } from "@/components/runs/RunDetailsCard";
import { CrawlerInfoCard } from "@/components/runs/CrawlerInfoCard";
import { PagesSection } from "@/components/runs/PagesSection";

const RunDetails = () => {
  const { runId } = useParams();

  const { data: run } = useQuery({
    queryKey: ['run', runId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("runs")
        .select(`
          *,
          crawler (
            crawler_id,
            name,
            description
          )
        `)
        .eq("run_id", runId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!runId,
  });

  const { data: pages } = useQuery({
    queryKey: ['run-pages', runId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("run_id", runId);

      if (error) throw error;
      return data;
    },
    enabled: !!runId,
  });

  const { data: pageCounts } = useQuery({
    queryKey: ['run-page-counts', runId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("status")
        .eq("run_id", runId);

      if (error) throw error;

      const counts = {
        queued: 0,
        completed: 0,
        failed: 0,
        total: data.length,
      };

      data.forEach((page) => {
        if (page.status === 'queued') counts.queued++;
        if (page.status === 'completed') counts.completed++;
        if (page.status === 'failed') counts.failed++;
      });

      return counts;
    },
    enabled: !!runId,
  });

  if (!run) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <RunDetailsCard run={run} />
        <CrawlerInfoCard crawler={run.crawler} />
      </div>
      <PagesSection pages={pages || []} pageCounts={pageCounts} />
    </div>
  );
};

export default RunDetails;
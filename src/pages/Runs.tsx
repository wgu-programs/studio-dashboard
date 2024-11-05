import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RunsTable } from "@/components/runs/RunsTable";

const Runs = () => {
  const [runs, setRuns] = useState<any[]>([]);
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  const fetchRuns = async () => {
    try {
      const { data, error } = await supabase
        .from("runs")
        .select(`
          *,
          crawler (
            crawler_id,
            name
          )
        `)
        .order("started_at", { ascending: false })
        .eq("archived", false);

      if (error) throw error;
      setRuns(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch runs",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  return (
    <div className="space-y-6">
      <PageTitle>Runs</PageTitle>
      <RunsTable runs={runs} />
    </div>
  );
};

export default Runs;
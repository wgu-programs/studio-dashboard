import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RunsTable } from "@/components/runs/RunsTable";

const Runs = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [runs, setRuns] = useState<any[]>([]);
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  const fetchRuns = async () => {
    try {
      let query = supabase
        .from("runs")
        .select(`
          *,
          crawler (
            name
          )
        `)
        .order("started_at", { ascending: false });

      if (!showArchived) {
        query = query.eq("archived", false);
      }

      const { data, error } = await query;

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
  }, [showArchived]);

  return (
    <div className="space-y-6">
      <PageTitle>Runs</PageTitle>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="show-archived"
          checked={showArchived}
          onCheckedChange={setShowArchived}
        />
        <Label htmlFor="show-archived">Show archived runs</Label>
      </div>

      <RunsTable runs={runs} />
    </div>
  );
};

export default Runs;
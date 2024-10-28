import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface Run {
  run_id: string;
  name: string;
  description: string | null;
  status: string;
  started_at: string;
  completed_at: string | null;
  crawler: {
    name: string;
  } | null;
}

const RunDetails = () => {
  const { runId } = useParams();
  const [run, setRun] = useState<Run | null>(null);
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  const fetchRun = async () => {
    try {
      const { data, error } = await supabase
        .from("runs")
        .select(`
          *,
          crawler (
            name
          )
        `)
        .eq("run_id", runId)
        .single();

      if (error) throw error;
      setRun(data);
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
      <PageTitle>{run.name || "Unnamed Run"}</PageTitle>

      <Card>
        <CardHeader>
          <CardTitle>Run Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Status</h3>
            <p className="text-sm text-muted-foreground capitalize">{run.status}</p>
          </div>
          <div>
            <h3 className="font-medium">Crawler</h3>
            <p className="text-sm text-muted-foreground">{run.crawler?.name || "Unknown Crawler"}</p>
          </div>
          <div>
            <h3 className="font-medium">Started</h3>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(run.started_at), { addSuffix: true })}
            </p>
          </div>
          {run.completed_at && (
            <div>
              <h3 className="font-medium">Completed</h3>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(run.completed_at), { addSuffix: true })}
              </p>
            </div>
          )}
          {run.description && (
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-sm text-muted-foreground">{run.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RunDetails;
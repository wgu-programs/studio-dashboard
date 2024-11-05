import { Button } from "@/components/ui/button";
import { PauseIcon, SquareX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RunControlsProps {
  runId: string;
  status: string | null;
}

export const RunControls = ({ runId, status }: RunControlsProps) => {
  const { toast } = useToast();

  const updateRunStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from("runs")
        .update({ status: newStatus })
        .eq("run_id", runId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Run ${newStatus} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${newStatus} run`,
        variant: "destructive",
      });
    }
  };

  if (status !== "running" && status !== "queued") {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => updateRunStatus("paused")}
        disabled={status === "paused"}
      >
        <PauseIcon className="h-4 w-4" />
        <span className="ml-2">Pause</span>
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => updateRunStatus("cancelled")}
      >
        <SquareX className="h-4 w-4" />
        <span className="ml-2">Stop</span>
      </Button>
    </div>
  );
};
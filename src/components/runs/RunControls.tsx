import { Button } from "@/components/ui/button";
import { PauseIcon, SquareX, PlayIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RunControlsProps {
  runId: string;
  status: string | null;
}

export const RunControls = ({ runId, status }: RunControlsProps) => {
  const updateRunStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from("runs")
        .update({ status: newStatus })
        .eq("run_id", runId);

      if (error) throw error;
    } catch (error) {
      console.error(`Failed to ${newStatus} run`, error);
    }
  };

  if (status !== "running" && status !== "queued" && status !== "paused") {
    return null;
  }

  return (
    <div className="flex gap-2">
      {status === "paused" ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateRunStatus("running")}
        >
          <PlayIcon className="h-4 w-4" />
          <span className="ml-2">Resume</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateRunStatus("paused")}
          disabled={status === "paused"}
        >
          <PauseIcon className="h-4 w-4" />
          <span className="ml-2">Pause</span>
        </Button>
      )}
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
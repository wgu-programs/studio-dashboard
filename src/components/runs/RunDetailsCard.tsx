import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Run } from "@/integrations/supabase/types/runs";

interface RunDetailsCardProps {
  run: Run;
}

export const RunDetailsCard = ({ run }: RunDetailsCardProps) => {
  return (
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
          <h3 className="font-medium">Started</h3>
          <p className="text-sm text-muted-foreground">
            {run.started_at
              ? formatDistanceToNow(new Date(run.started_at), { addSuffix: true })
              : "Not started"}
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
  );
};
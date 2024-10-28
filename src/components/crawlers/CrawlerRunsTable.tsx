import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Run {
  run_id: string;
  name: string | null;
  status: string | null;
  started_at: string | null;
  completed_at: string | null;
}

interface CrawlerRunsTableProps {
  runs: Run[];
}

export const CrawlerRunsTable = ({ runs }: CrawlerRunsTableProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Runs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((run) => (
              <TableRow 
                key={run.run_id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/runs/${run.run_id}`)}
              >
                <TableCell>{run.name || "Unnamed Run"}</TableCell>
                <TableCell>{run.status}</TableCell>
                <TableCell>
                  {run.started_at
                    ? formatDistanceToNow(new Date(run.started_at), {
                        addSuffix: true,
                      })
                    : "Not started"}
                </TableCell>
                <TableCell>
                  {run.completed_at
                    ? formatDistanceToNow(new Date(run.completed_at), {
                        addSuffix: true,
                      })
                    : "Not completed"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
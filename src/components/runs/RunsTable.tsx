import { formatDistanceToNow } from "date-fns";
import { useNavigate, Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RunsTableProps {
  runs: any[];
}

const statusOrder = {
  running: 0,
  queued: 1,
  completed: 2,
  stopped: 3,
  paused: 4,
};

export const RunsTable = ({ runs }: RunsTableProps) => {
  const navigate = useNavigate();

  // Group runs by status
  const groupedRuns = runs.reduce((acc, run) => {
    const status = run.status || 'unknown';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(run);
    return acc;
  }, {} as Record<string, typeof runs>);

  // Sort status groups based on priority
  const sortedStatuses = Object.keys(groupedRuns).sort((a, b) => {
    return (statusOrder[a as keyof typeof statusOrder] || 999) - 
           (statusOrder[b as keyof typeof statusOrder] || 999);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500';
      case 'queued':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'stopped':
        return 'bg-red-500';
      case 'paused':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {sortedStatuses.map((status) => (
        <div key={status} className="space-y-2">
          <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
            {status}
            <Badge variant="secondary">{groupedRuns[status].length}</Badge>
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Crawler</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedRuns[status].map((run) => (
                <TableRow 
                  key={run.run_id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/runs/${run.run_id}`)}
                >
                  <TableCell className="font-medium">
                    {run.name || "Unnamed Run"}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {run.crawler ? (
                      <Link 
                        to={`/crawlers/${run.crawler.crawler_id}`}
                        className="text-primary hover:underline"
                      >
                        {run.crawler.name || "Unnamed Crawler"}
                      </Link>
                    ) : (
                      "No crawler"
                    )}
                  </TableCell>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          run.status
                        )}`}
                      />
                      <span className="capitalize">{run.status}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};
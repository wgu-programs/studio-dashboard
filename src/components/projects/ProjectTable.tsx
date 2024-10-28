import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

interface Project {
  project_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export const ProjectTable = ({ projects }: { projects: Project[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.project_id}>
            <TableCell className="font-medium">{project.name}</TableCell>
            <TableCell>{project.description || "No description"}</TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(project.created_at), {
                addSuffix: true,
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
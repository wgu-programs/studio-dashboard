import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface Project {
  project_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export const ProjectCards = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.project_id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl">{project.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground min-h-[3rem]">
              {project.description || "No description"}
            </p>
            <p className="text-sm text-muted-foreground">
              Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
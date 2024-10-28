import { formatDistanceToNow } from "date-fns";
import { ProjectDescription } from "./ProjectDescription";

interface ProjectMetadataProps {
  createdAt: string;
  projectId: string;
  description: string | null;
  onProjectUpdate: () => void;
}

export const ProjectMetadata = ({ createdAt, projectId, description, onProjectUpdate }: ProjectMetadataProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Project Info</h2>
      <div className="space-y-4">
        <ProjectDescription
          projectId={projectId}
          description={description}
          onProjectUpdate={onProjectUpdate}
        />
        <p className="text-sm text-muted-foreground">
          Created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};
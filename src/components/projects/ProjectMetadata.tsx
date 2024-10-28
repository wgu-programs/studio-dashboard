import { formatDistanceToNow } from "date-fns";

interface ProjectMetadataProps {
  createdAt: string;
}

export const ProjectMetadata = ({ createdAt }: ProjectMetadataProps) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Project Info</h2>
      <div>
        <p className="text-sm text-muted-foreground">
          Created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};
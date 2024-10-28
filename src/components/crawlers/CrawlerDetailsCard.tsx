import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StartUrlsList } from "./StartUrlsList";

interface CrawlerDetailsCardProps {
  crawler: any;
  isEditing: boolean;
  name: string;
  description: string;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: () => void;
}

export const CrawlerDetailsCard = ({
  crawler,
  isEditing,
  name,
  description,
  setName,
  setDescription,
  onSave,
  onCancel,
  onUpdate,
}: CrawlerDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crawler Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={onSave}>Save</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>Project</Label>
              {crawler.project ? (
                <Link 
                  to={`/projects/${crawler.project_id}`}
                  className="text-sm text-blue-500 hover:underline block"
                >
                  {crawler.project.name}
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">No project assigned</p>
              )}
            </div>
            <div>
              <Label>Description</Label>
              <p className="text-sm text-muted-foreground">
                {crawler.description || "No description"}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Start URLs</Label>
              <StartUrlsList
                crawlerId={crawler.crawler_id}
                initialUrls={crawler.start_urls || []}
                onUpdate={onUpdate}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
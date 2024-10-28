import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateRunName } from "@/utils/nameGenerator";

interface Crawler {
  crawler_id: string;
  name: string | null;
  description: string | null;
  project_id: string | null;
  project: {
    name: string;
  } | null;
}

const CrawlerDetails = () => {
  const { crawlerId } = useParams();
  const [crawler, setCrawler] = useState<Crawler | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  const fetchCrawler = async () => {
    try {
      const { data, error } = await supabase
        .from("crawler")
        .select(`
          *,
          project:projects(name)
        `)
        .eq("crawler_id", crawlerId)
        .single();

      if (error) throw error;
      setCrawler(data);
      setName(data.name || "");
      setDescription(data.description || "");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch crawler details",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("crawler")
        .update({
          name,
          description,
        })
        .eq("crawler_id", crawlerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Crawler updated successfully",
      });
      
      setIsEditing(false);
      fetchCrawler();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update crawler",
        variant: "destructive",
      });
    }
  };

  const handleRunCrawler = async () => {
    try {
      const { error } = await supabase
        .from("runs")
        .insert([
          {
            crawler_id: crawlerId,
            status: "queued",
            started_at: new Date().toISOString(),
            name: generateRunName(),
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Crawler started successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start crawler",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (crawlerId) {
      fetchCrawler();
    }
  }, [crawlerId]);

  if (!crawler) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageTitle>
        <div className="flex justify-between items-center">
          <span>{crawler.name || "Unnamed Crawler"}</span>
          <div className="space-x-2">
            {!isEditing && (
              <>
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit
                </Button>
                <Button onClick={handleRunCrawler}>Run Crawler</Button>
              </>
            )}
          </div>
        </div>
      </PageTitle>

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
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Project</Label>
                <p className="text-sm text-muted-foreground">
                  {crawler.project?.name || "No project assigned"}
                </p>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground">
                  {crawler.description || "No description"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CrawlerDetails;

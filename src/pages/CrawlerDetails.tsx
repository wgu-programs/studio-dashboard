import { useEffect, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateRunName } from "@/utils/nameGenerator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

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
  const navigate = useNavigate();
  const [crawler, setCrawler] = useState<Crawler | null>(null);
  const [runs, setRuns] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  const fetchCrawler = async () => {
    try {
      const { data: crawlerData, error: crawlerError } = await supabase
        .from("crawler")
        .select(`
          *,
          project:projects(name)
        `)
        .eq("crawler_id", crawlerId)
        .single();

      if (crawlerError) throw crawlerError;
      setCrawler(crawlerData);
      setName(crawlerData.name || "");
      setDescription(crawlerData.description || "");

      const { data: runsData, error: runsError } = await supabase
        .from("runs")
        .select("*")
        .eq("crawler_id", crawlerId)
        .order("started_at", { ascending: false });

      if (runsError) throw runsError;
      setRuns(runsData || []);
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
      
      fetchCrawler();
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
    </div>
  );
};

export default CrawlerDetails;

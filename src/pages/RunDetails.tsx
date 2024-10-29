import { useEffect, useState } from "react";
import { useParams, useOutletContext, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Run } from "@/integrations/supabase/types/runs";
import { Crawler } from "@/integrations/supabase/types/crawler";
import { Page } from "@/integrations/supabase/types/pages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTable } from "@/components/pages/PageTable";
import { PageCards } from "@/components/pages/PageCards";

interface RunWithCrawler extends Run {
  crawler: Partial<Crawler> | null;
}

const RunDetails = () => {
  const { runId } = useParams();
  const [run, setRun] = useState<RunWithCrawler | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  const fetchRun = async () => {
    try {
      const { data, error } = await supabase
        .from("runs")
        .select(`
          *,
          crawler (
            crawler_id,
            name,
            description,
            status
          )
        `)
        .eq("run_id", runId)
        .single();

      if (error) throw error;
      setRun(data);

      const { data: pagesData, error: pagesError } = await supabase
        .from("pages")
        .select("*")
        .eq("run_id", runId);

      if (pagesError) throw pagesError;
      setPages(pagesData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch run details",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (runId) {
      fetchRun();
    }
  }, [runId]);

  if (!run) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageTitle>{run.name || "Unnamed Run"}</PageTitle>

      <div className="grid gap-6 md:grid-cols-2">
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

        <Card>
          <CardHeader>
            <CardTitle>Crawler Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {run.crawler ? (
              <>
                <div>
                  <h3 className="font-medium">Name</h3>
                  <Link 
                    to={`/crawlers/${run.crawler.crawler_id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {run.crawler.name || "Unnamed Crawler"}
                  </Link>
                </div>
                <div>
                  <h3 className="font-medium">Status</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {run.crawler.status}
                  </p>
                </div>
                {run.crawler.description && (
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {run.crawler.description}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No crawler information available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cards">
            <TabsList>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
            <TabsContent value="cards">
              <PageCards pages={pages} />
            </TabsContent>
            <TabsContent value="table">
              <PageTable pages={pages} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RunDetails;

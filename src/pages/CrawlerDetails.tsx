import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CrawlerDetailsCard } from "@/components/crawlers/CrawlerDetailsCard";
import { RunCrawlerButton } from "@/components/crawlers/RunCrawlerButton";
import { CrawlerRunsTable } from "@/components/crawlers/CrawlerRunsTable";
import { Crawler } from "@/integrations/supabase/types/crawler";

const CrawlerDetails = () => {
  const { crawlerId } = useParams();
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
      setCrawler({
        ...crawlerData,
        workspace_id: crawlerData.workspace_id?.toString()
      });
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
                <RunCrawlerButton 
                  crawlerId={crawler.crawler_id} 
                  startUrls={crawler.start_urls}
                  onRunCreated={fetchCrawler}
                />
              </>
            )}
          </div>
        </div>
      </PageTitle>

      <CrawlerDetailsCard
        crawler={crawler}
        isEditing={isEditing}
        name={name}
        description={description}
        setName={setName}
        setDescription={setDescription}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
        onUpdate={fetchCrawler}
      />

      <CrawlerRunsTable runs={runs} />
    </div>
  );
};

export default CrawlerDetails;
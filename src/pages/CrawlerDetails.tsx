import { useEffect, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CrawlerDetailsCard } from "@/components/crawlers/CrawlerDetailsCard";
import { RunCrawlerButton } from "@/components/crawlers/RunCrawlerButton";
import { CrawlerRunsTable } from "@/components/crawlers/CrawlerRunsTable";
import { Crawler } from "@/integrations/supabase/types/crawler";

const CrawlerDetails = () => {
  const { crawlerId } = useParams<{ crawlerId: string }>();
  const navigate = useNavigate();
  const [crawler, setCrawler] = useState<Crawler | null>(null);
  const [runs, setRuns] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  const fetchCrawler = async () => {
    try {
      setIsLoading(true);
      
      const { data: crawlerData, error: crawlerError } = await supabase
        .from("crawler")
        .select(`
          *,
          project:projects(name)
        `)
        .eq("crawler_id", crawlerId)
        .single();

      if (crawlerError) {
        if (crawlerError.code === "PGRST116") {
          toast({
            title: "Error",
            description: "Crawler not found",
            variant: "destructive",
          });
          navigate("/crawlers");
          return;
        }
        throw crawlerError;
      }

      if (!crawlerData) {
        toast({
          title: "Error",
          description: "Crawler not found",
          variant: "destructive",
        });
        navigate("/crawlers");
        return;
      }

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
    } catch (error: any) {
      console.error("Error fetching crawler:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch crawler details",
        variant: "destructive",
      });
      navigate("/crawlers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!crawlerId) {
        toast({
          title: "Error",
          description: "No crawler ID provided",
          variant: "destructive",
        });
        return;
      }

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
    } catch (error: any) {
      console.error("Error updating crawler:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update crawler",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!crawlerId) {
      toast({
        title: "Error",
        description: "No crawler ID provided",
        variant: "destructive",
      });
      navigate("/crawlers");
      return;
    }
    fetchCrawler();
  }, [crawlerId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!crawler) {
    return null;
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
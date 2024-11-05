import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CrawlerTable } from "@/components/crawlers/CrawlerTable";
import { NewCrawlerDialog } from "@/components/crawlers/NewCrawlerDialog";

const Crawlers = () => {
  const [crawlers, setCrawlers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  const fetchCrawlers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("crawler")
        .select(`
          *,
          runs (*),
          project:projects(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCrawlers(data || []);
    } catch (error: any) {
      console.error("Error fetching crawlers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch crawlers. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrawlers();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageTitle>Crawlers</PageTitle>
      
      <div className="flex justify-end">
        <NewCrawlerDialog onCrawlerCreated={fetchCrawlers} />
      </div>

      <CrawlerTable 
        crawlers={crawlers} 
        showArchived={false}
        onRunStatusChange={fetchCrawlers}
      />
    </div>
  );
};

export default Crawlers;
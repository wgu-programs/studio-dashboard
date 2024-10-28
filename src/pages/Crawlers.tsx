import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CrawlerTable } from "@/components/crawlers/CrawlerTable";
import { NewCrawlerDialog } from "@/components/crawlers/NewCrawlerDialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Crawlers = () => {
  const [crawlers, setCrawlers] = useState<any[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  const fetchCrawlers = async () => {
    try {
      const { data, error } = await supabase
        .from("crawler")
        .select(`
          *,
          runs (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCrawlers(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch crawlers",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCrawlers();
  }, []);

  return (
    <div className="space-y-6">
      <PageTitle>Crawlers</PageTitle>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-archived"
            checked={showArchived}
            onCheckedChange={setShowArchived}
          />
          <Label htmlFor="show-archived">Show archived runs</Label>
        </div>
        <NewCrawlerDialog onCrawlerCreated={fetchCrawlers} />
      </div>

      <CrawlerTable 
        crawlers={crawlers} 
        showArchived={showArchived}
        onRunStatusChange={fetchCrawlers}
      />
    </div>
  );
};

export default Crawlers;
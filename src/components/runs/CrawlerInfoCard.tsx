import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Crawler } from "@/integrations/supabase/types/crawler";

interface CrawlerInfoCardProps {
  crawler: Partial<Crawler> | null;
}

export const CrawlerInfoCard = ({ crawler }: CrawlerInfoCardProps) => {
  if (!crawler) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crawler Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No crawler information available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crawler Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Name</h3>
          <Link 
            to={`/crawlers/${crawler.crawler_id}`}
            className="text-sm text-primary hover:underline"
          >
            {crawler.name || "Unnamed Crawler"}
          </Link>
        </div>
        <div>
          <h3 className="font-medium">Status</h3>
          <p className="text-sm text-muted-foreground capitalize">
            {crawler.status}
          </p>
        </div>
        {crawler.description && (
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">
              {crawler.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Page } from "@/integrations/supabase/types/pages";
import { formatDistanceToNow } from "date-fns";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Loader2 } from "lucide-react";

const PageDetails = () => {
  const { pageId } = useParams();
  const [page, setPage] = useState<Page | null>(null);
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  const fetchPage = async () => {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("page_id", pageId)
        .single();

      if (error) throw error;
      setPage(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch page details",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (pageId) {
      fetchPage();
    }
  }, [pageId]);

  if (!page) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageTitle>{page.title || "Untitled Page"}</PageTitle>

      <Card className="overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          {page.status === "queued" ? (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <img
              src={page.snapshot_url || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"}
              alt={page.title || "Page snapshot"}
              className="object-cover w-full h-full"
            />
          )}
        </AspectRatio>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Page Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">URL</h3>
              <a 
                href={page.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {page.url}
              </a>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <p className="text-sm text-muted-foreground">{page.status}</p>
            </div>
            <div>
              <h3 className="font-medium">Created</h3>
              <p className="text-sm text-muted-foreground">
                {page.created_at && formatDistanceToNow(new Date(page.created_at), { addSuffix: true })}
              </p>
            </div>
            {page.description && (
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">{page.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {page.author && (
              <div>
                <h3 className="font-medium">Author</h3>
                <p className="text-sm text-muted-foreground">{page.author}</p>
              </div>
            )}
            {page.date_published && (
              <div>
                <h3 className="font-medium">Published Date</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(page.date_published), { addSuffix: true })}
                </p>
              </div>
            )}
            {page.date_modified && (
              <div>
                <h3 className="font-medium">Modified Date</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(page.date_modified), { addSuffix: true })}
                </p>
              </div>
            )}
            {page.keywords && page.keywords.length > 0 && (
              <div>
                <h3 className="font-medium">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {page.keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="text-sm bg-muted px-2 py-1 rounded-md"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {page.html && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>HTML Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto">
                <pre className="text-sm bg-muted p-4 rounded-md">
                  {page.html}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PageDetails;
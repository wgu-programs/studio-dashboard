import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types/json";

interface StartUrlsListProps {
  crawlerId: string;
  initialUrls: Json | null;
  onUpdate: () => void;
}

export const StartUrlsList = ({ crawlerId, initialUrls, onUpdate }: StartUrlsListProps) => {
  const [urls, setUrls] = useState<string[]>(() => {
    if (Array.isArray(initialUrls)) {
      return initialUrls as string[];
    }
    return [];
  });
  const [newUrl, setNewUrl] = useState("");
  const { toast } = useToast();

  const handleAddUrl = () => {
    if (!newUrl.trim()) return;
    const updatedUrls = [...urls, newUrl];
    setUrls(updatedUrls);
    setNewUrl("");
    updateStartUrls(updatedUrls);
  };

  const handleRemoveUrl = (index: number) => {
    const updatedUrls = urls.filter((_, i) => i !== index);
    setUrls(updatedUrls);
    updateStartUrls(updatedUrls);
  };

  const updateStartUrls = async (updatedUrls: string[]) => {
    const { error } = await supabase
      .from("crawler")
      .update({ start_urls: updatedUrls })
      .eq("crawler_id", crawlerId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update start URLs",
        variant: "destructive",
      });
      return;
    }

    onUpdate();
    toast({
      title: "Success",
      description: "Start URLs updated successfully",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddUrl();
            }
          }}
        />
        <Button onClick={handleAddUrl}>
          <Plus className="h-4 w-4 mr-2" />
          Add URL
        </Button>
      </div>
      <div className="space-y-2">
        {urls.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input value={url} readOnly />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveUrl(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
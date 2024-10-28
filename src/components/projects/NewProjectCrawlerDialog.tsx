import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { generateCrawlerName } from "@/utils/nameGenerator";

interface NewProjectCrawlerDialogProps {
  projectId: string;
  onCrawlerCreated: () => void;
}

export const NewProjectCrawlerDialog = ({ projectId, onCrawlerCreated }: NewProjectCrawlerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(generateCrawlerName());
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("crawler")
        .insert([
          {
            name,
            description,
            project_id: projectId,
            status: "queued",
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Crawler created successfully",
      });

      setOpen(false);
      setName(generateCrawlerName());
      setDescription("");
      onCrawlerCreated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create crawler",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Crawler
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Crawler</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter crawler name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter crawler description"
            />
          </div>
          <Button type="submit" className="w-full">
            Create Crawler
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
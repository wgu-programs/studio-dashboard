import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/context/WorkspaceContext";
import { generateProjectName } from "@/utils/nameGenerator";

export const NewProjectDialog = ({ onProjectCreated }: { onProjectCreated: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(generateProjectName());
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const { currentWorkspaceId } = useWorkspace();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const workspaceIdNumber = currentWorkspaceId ? parseInt(currentWorkspaceId) : null;
      
      const { error } = await supabase
        .from("projects")
        .insert({
          name,
          description: description || null,
          workspace_id: workspaceIdNumber,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project created successfully",
      });
      setIsOpen(false);
      setName(generateProjectName());
      setDescription("");
      onProjectCreated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
            />
          </div>
          <Button type="submit" className="w-full">
            Create Project
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
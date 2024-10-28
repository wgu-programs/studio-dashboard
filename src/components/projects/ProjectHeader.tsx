import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProjectHeaderProps {
  projectId: string;
  name: string;
  onProjectUpdate: () => void;
}

export const ProjectHeader = ({ projectId, name, onProjectUpdate }: ProjectHeaderProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(name);
  const { toast } = useToast();

  const handleSaveTitle = async () => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ name: editedTitle })
        .eq("project_id", projectId);

      if (error) throw error;

      setIsEditingTitle(false);
      onProjectUpdate();
      toast({
        title: "Success",
        description: "Project name updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project name",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isEditingTitle ? (
        <div className="flex items-center gap-2 w-full">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="text-4xl font-bold h-12"
          />
          <Button size="icon" variant="ghost" onClick={handleSaveTitle}>
            <Check className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => {
              setIsEditingTitle(false);
              setEditedTitle(name);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 group w-full">
          <h1 className="text-4xl font-bold">{name}</h1>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditingTitle(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
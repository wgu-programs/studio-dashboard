import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProjectDescriptionProps {
  projectId: string;
  description: string | null;
  onProjectUpdate: () => void;
}

export const ProjectDescription = ({ projectId, description, onProjectUpdate }: ProjectDescriptionProps) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description || "");
  const { toast } = useToast();

  const handleSaveDescription = async () => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ description: editedDescription })
        .eq("project_id", projectId);

      if (error) throw error;

      setIsEditingDescription(false);
      onProjectUpdate();
      toast({
        title: "Success",
        description: "Project description updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project description",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Description</h2>
      {isEditingDescription ? (
        <div className="space-y-2">
          <Textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            rows={4}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveDescription}>
              Save
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setIsEditingDescription(false);
                setEditedDescription(description || "");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
          onClick={() => setIsEditingDescription(true)}
        >
          <p className="text-muted-foreground">
            {description || "No description"}
          </p>
        </div>
      )}
    </div>
  );
};
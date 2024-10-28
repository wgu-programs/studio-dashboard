import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EditableField } from "@/components/ui/editable-field";

interface ProjectDescriptionProps {
  projectId: string;
  description: string | null;
  onProjectUpdate: () => void;
}

export const ProjectDescription = ({ projectId, description, onProjectUpdate }: ProjectDescriptionProps) => {
  const { toast } = useToast();

  const handleSave = async (newDescription: string) => {
    const { error } = await supabase
      .from("projects")
      .update({ description: newDescription })
      .eq("project_id", projectId);

    if (error) throw error;

    onProjectUpdate();
    toast({
      title: "Success",
      description: "Project description updated successfully",
    });
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Description</h2>
      <EditableField
        value={description || ""}
        onSave={handleSave}
        inputType="textarea"
        placeholder="No description"
        tag="p"
      />
    </div>
  );
};
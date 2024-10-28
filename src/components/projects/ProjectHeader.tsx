import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EditableField } from "@/components/ui/editable-field";

interface ProjectHeaderProps {
  projectId: string;
  name: string;
  onProjectUpdate: () => void;
}

export const ProjectHeader = ({ projectId, name, onProjectUpdate }: ProjectHeaderProps) => {
  const { toast } = useToast();

  const handleSave = async (newName: string) => {
    const { error } = await supabase
      .from("projects")
      .update({ name: newName })
      .eq("project_id", projectId);

    if (error) throw error;

    onProjectUpdate();
    toast({
      title: "Success",
      description: "Project name updated successfully",
    });
  };

  return (
    <EditableField
      value={name}
      onSave={handleSave}
      inputClassName="text-4xl font-bold h-12"
      className="w-full"
    />
  );
};
import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Pencil, X } from "lucide-react";

interface Project {
  project_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("project_id", projectId)
          .single();

        if (error) throw error;
        setProject(data);
        setEditedTitle(data.name);
        setEditedDescription(data.description || "");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch project details",
          variant: "destructive",
        });
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, toast]);

  const handleSaveTitle = async () => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ name: editedTitle })
        .eq("project_id", projectId);

      if (error) throw error;

      setProject(prev => prev ? { ...prev, name: editedTitle } : null);
      setIsEditingTitle(false);
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

  const handleSaveDescription = async () => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ description: editedDescription })
        .eq("project_id", projectId);

      if (error) throw error;

      setProject(prev => prev ? { ...prev, description: editedDescription } : null);
      setIsEditingDescription(false);
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

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
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
                setEditedTitle(project.name);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group w-full">
            <PageTitle>{project.name}</PageTitle>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
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
                        setEditedDescription(project.description || "");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="group cursor-pointer" 
                  onClick={() => setIsEditingDescription(true)}
                >
                  <p className="text-muted-foreground">
                    {project.description || "No description"}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity mt-2"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit description
                  </Button>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium">Created</h3>
              <p className="text-muted-foreground">
                {formatDistanceToNow(new Date(project.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetails;
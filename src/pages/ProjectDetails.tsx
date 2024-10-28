import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

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

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageTitle>{project.name}</PageTitle>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground">
                {project.description || "No description"}
              </p>
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
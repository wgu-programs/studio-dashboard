import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectDescription } from "@/components/projects/ProjectDescription";
import { ProjectMetadata } from "@/components/projects/ProjectMetadata";
import { ProjectCrawlers } from "@/components/projects/ProjectCrawlers";

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

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <PageTitle>
        <ProjectHeader 
          projectId={project.project_id} 
          name={project.name}
          onProjectUpdate={fetchProject}
        />
      </PageTitle>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <ProjectDescription
            projectId={project.project_id}
            description={project.description}
            onProjectUpdate={fetchProject}
          />
          <ProjectCrawlers projectId={project.project_id} />
        </div>
        <div>
          <ProjectMetadata createdAt={project.created_at} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
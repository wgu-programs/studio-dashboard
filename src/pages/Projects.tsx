import { useState, useEffect } from "react";
import { ProjectTable } from "@/components/projects/ProjectTable";
import { ProjectCards } from "@/components/projects/ProjectCards";
import { NewProjectDialog } from "@/components/projects/NewProjectDialog";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useOutletContext } from "react-router-dom";

const Projects = () => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [projects, setProjects] = useState<any[]>([]);
  const { toast } = useToast();
  const { currentWorkspaceId } = useWorkspace();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  const fetchProjects = async () => {
    try {
      let query = supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (currentWorkspaceId) {
        const workspaceIdNumber = parseInt(currentWorkspaceId);
        if (!isNaN(workspaceIdNumber)) {
          query = query.eq("workspace_id", workspaceIdNumber);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (currentWorkspaceId) {
      fetchProjects();
    } else {
      setProjects([]);
    }
  }, [currentWorkspaceId]);

  return (
    <div className="space-y-6">
      <PageTitle>Projects</PageTitle>
      
      <div className="flex justify-end items-center gap-4">
        <div className="flex items-center border rounded-lg overflow-hidden">
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <Table className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
        <NewProjectDialog onProjectCreated={fetchProjects} />
      </div>

      {viewMode === "table" ? (
        <ProjectTable projects={projects} />
      ) : (
        <ProjectCards projects={projects} />
      )}
    </div>
  );
};

export default Projects;

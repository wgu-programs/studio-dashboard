import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";
import { useWorkspace } from "@/context/WorkspaceContext";

export const WorkspaceSelector = () => {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const { currentWorkspaceId, setCurrentWorkspaceId } = useWorkspace();
  const { toast } = useToast();

  const fetchWorkspaces = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Error",
          description: "Please log in to view workspaces",
          variant: "destructive",
        });
        return;
      }

      const { data: workspaceUsers, error: workspaceError } = await supabase
        .from("workspace_users")
        .select(`
          workspace_id,
          workspaces (
            id,
            name,
            description
          )
        `)
        .eq('user_id', session.session.user.id);

      if (workspaceError) {
        toast({
          title: "Error",
          description: "Failed to fetch workspaces",
          variant: "destructive",
        });
        return;
      }

      if (workspaceUsers) {
        const workspaces = workspaceUsers
          .map((wu: any) => wu.workspaces)
          .filter(Boolean);
        setWorkspaces(workspaces);
        if (workspaces.length > 0 && !currentWorkspaceId) {
          setCurrentWorkspaceId(workspaces[0].id.toString());
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch workspaces",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleWorkspaceChange = (value: string) => {
    setCurrentWorkspaceId(value);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={currentWorkspaceId || ""} onValueChange={handleWorkspaceChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select workspace" />
        </SelectTrigger>
        <SelectContent>
          {workspaces.map((workspace) => (
            <SelectItem key={workspace.id} value={workspace.id.toString()}>
              {workspace.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <CreateWorkspaceDialog onWorkspaceCreated={fetchWorkspaces} />
    </div>
  );
};
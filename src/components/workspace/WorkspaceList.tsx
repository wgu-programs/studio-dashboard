import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/context/WorkspaceContext";
import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface WorkspaceListProps {
  collapsed: boolean;
}

export const WorkspaceList = ({ collapsed }: WorkspaceListProps) => {
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

  return (
    <div className="px-4 py-2">
      {!collapsed && (
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Workspaces
          </h2>
          <CreateWorkspaceDialog onWorkspaceCreated={fetchWorkspaces} />
        </div>
      )}
      <div className="space-y-1">
        {workspaces.map((workspace) => (
          <button
            key={workspace.id}
            onClick={() => setCurrentWorkspaceId(workspace.id.toString())}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
              currentWorkspaceId === workspace.id.toString()
                ? "bg-gray-100 text-gray-900 dark:bg-gray-800/50 dark:text-gray-300"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800/50"
            )}
          >
            {collapsed ? (
              workspace.name.charAt(0).toUpperCase()
            ) : (
              workspace.name
            )}
          </button>
        ))}
        {collapsed && (
          <button
            onClick={() => document.querySelector<HTMLButtonElement>('[data-dialog-trigger="create-workspace"]')?.click()}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
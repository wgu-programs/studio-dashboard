import { useOutletContext } from "react-router-dom";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();
  const { currentWorkspaceId } = useWorkspace();

  const { data: workspace } = useQuery({
    queryKey: ['workspace', currentWorkspaceId],
    queryFn: async () => {
      if (!currentWorkspaceId) return null;
      const { data, error } = await supabase
        .from('workspaces')
        .select('name')
        .eq('id', currentWorkspaceId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!currentWorkspaceId
  });

  return (
    <div className="space-y-4">
      <PageTitle>{workspace?.name || 'Select a workspace'}</PageTitle>
    </div>
  );
};

export default Index;
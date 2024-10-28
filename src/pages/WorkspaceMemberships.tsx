import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface WorkspaceMembership {
  workspace: {
    id: number;
    name: string | null;
    description: string | null;
  };
  role: string | null;
}

const WorkspaceMemberships = () => {
  const [memberships, setMemberships] = useState<WorkspaceMembership[]>([]);
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  useEffect(() => {
    const fetchMemberships = async () => {
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

        const { data: workspaceUsers, error } = await supabase
          .from("workspace_users")
          .select(`
            workspace_id,
            role,
            workspaces (
              id,
              name,
              description
            )
          `)
          .eq('user_id', session.session.user.id);

        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch workspace memberships",
            variant: "destructive",
          });
          return;
        }

        const formattedMemberships = workspaceUsers.map((wu: any) => ({
          workspace: wu.workspaces,
          role: wu.role,
        }));

        setMemberships(formattedMemberships);
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    };

    fetchMemberships();
  }, [toast]);

  return (
    <div className="space-y-6">
      <PageTitle>My Workspace Memberships</PageTitle>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workspace Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships.map((membership) => (
              <TableRow key={membership.workspace.id}>
                <TableCell className="font-medium">
                  {membership.workspace.name || "Unnamed Workspace"}
                </TableCell>
                <TableCell>
                  {membership.workspace.description || "No description"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {membership.role || "member"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {memberships.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  You are not a member of any workspaces yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WorkspaceMemberships;
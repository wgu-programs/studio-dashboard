import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const WorkspaceSelector = () => {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({ name: "", description: "" });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    const { data: workspaceUsers } = await supabase
      .from("workspace_users")
      .select(`
        workspace_id,
        workspaces (
          id,
          name,
          description
        )
      `);

    if (workspaceUsers) {
      const workspaces = workspaceUsers.map((wu: any) => wu.workspaces);
      setWorkspaces(workspaces);
      if (workspaces.length > 0 && !currentWorkspace) {
        setCurrentWorkspace(workspaces[0].id.toString());
      }
    }
  };

  const createWorkspace = async () => {
    if (!newWorkspace.name.trim()) {
      toast({
        title: "Error",
        description: "Workspace name is required",
        variant: "destructive",
      });
      return;
    }

    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .insert([
        {
          name: newWorkspace.name,
          description: newWorkspace.description,
        },
      ])
      .select()
      .single();

    if (workspaceError) {
      toast({
        title: "Error",
        description: "Failed to create workspace",
        variant: "destructive",
      });
      return;
    }

    const { error: memberError } = await supabase.from("workspace_users").insert([
      {
        workspace_id: workspace.id,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        role: "owner",
      },
    ]);

    if (memberError) {
      toast({
        title: "Error",
        description: "Failed to add user to workspace",
        variant: "destructive",
      });
      return;
    }

    setIsOpen(false);
    setNewWorkspace({ name: "", description: "" });
    fetchWorkspaces();
    toast({
      title: "Success",
      description: "Workspace created successfully",
    });
  };

  const handleWorkspaceChange = (value: string) => {
    setCurrentWorkspace(value);
    // Refresh the current page to update data for the new workspace
    navigate(0);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={currentWorkspace} onValueChange={handleWorkspaceChange}>
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newWorkspace.name}
                onChange={(e) =>
                  setNewWorkspace({ ...newWorkspace, name: e.target.value })
                }
                placeholder="Enter workspace name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newWorkspace.description}
                onChange={(e) =>
                  setNewWorkspace({
                    ...newWorkspace,
                    description: e.target.value,
                  })
                }
                placeholder="Enter workspace description"
              />
            </div>
            <Button onClick={createWorkspace} className="w-full">
              Create Workspace
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
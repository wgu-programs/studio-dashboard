import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export const CreateWorkspaceDialog = ({ onWorkspaceCreated }: { onWorkspaceCreated: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({ name: "", description: "" });
  const { toast } = useToast();
  const navigate = useNavigate();

  const createWorkspace = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Error",
          description: "Please log in to create a workspace",
          variant: "destructive",
        });
        return;
      }

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

      const { error: memberError } = await supabase
        .from("workspace_users")
        .insert([
          {
            workspace_id: workspace.id,
            user_id: session.session.user.id,
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
      onWorkspaceCreated();
      
      toast({
        title: "Success",
        description: "Workspace created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
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
  );
};
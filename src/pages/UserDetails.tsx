import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { type Profile } from "@/integrations/supabase/types/profiles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkspaceMembership {
  workspace: {
    id: number;
    name: string | null;
    description: string | null;
  };
  role: string | null;
}

const UserDetails = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [memberships, setMemberships] = useState<WorkspaceMembership[]>([]);
  const [availableWorkspaces, setAvailableWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("member");
  const { toast } = useToast();
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch user profile",
          variant: "destructive",
        });
        return;
      }

      setProfile(data);
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
    };

    const fetchMemberships = async () => {
      const { data, error } = await supabase
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
        .eq('user_id', userId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch workspace memberships",
          variant: "destructive",
        });
        return;
      }

      setMemberships(data.map((wu: any) => ({
        workspace: wu.workspaces,
        role: wu.role,
      })));
    };

    const fetchAvailableWorkspaces = async () => {
      const { data, error } = await supabase
        .from("workspaces")
        .select("*");

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch workspaces",
          variant: "destructive",
        });
        return;
      }

      setAvailableWorkspaces(data);
    };

    if (userId) {
      fetchProfile();
      fetchMemberships();
      fetchAvailableWorkspaces();
    }
  }, [userId, toast]);

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${profile?.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", profile?.id);

      if (updateError) {
        throw updateError;
      }

      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      if (!profile) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setProfile(prev => prev ? { ...prev, first_name: firstName, last_name: lastName } : null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddToWorkspace = async () => {
    if (!selectedWorkspace || !selectedRole) {
      toast({
        title: "Error",
        description: "Please select both workspace and role",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("workspace_users")
      .insert({
        workspace_id: parseInt(selectedWorkspace),
        user_id: userId,
        role: selectedRole
      });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Error",
          description: "User is already a member of this workspace",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add user to workspace",
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Success",
      description: "User added to workspace successfully",
    });

    // Refresh memberships
    const { data: newMemberships } = await supabase
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
      .eq('user_id', userId);

    if (newMemberships) {
      setMemberships(newMemberships.map((wu: any) => ({
        workspace: wu.workspaces,
        role: wu.role,
      })));
    }

    setSelectedWorkspace("");
    setSelectedRole("member");
  };

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <PageTitle>User Details</PageTitle>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback>
                  {profile.first_name?.[0]}
                  {profile.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  disabled={uploading}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                />
              </div>

              <Button 
                onClick={handleProfileUpdate}
                className="w-full"
              >
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workspace Memberships</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="workspace">Workspace</Label>
                <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWorkspaces.map((workspace) => (
                      <SelectItem key={workspace.id} value={workspace.id.toString()}>
                        {workspace.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="role">Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddToWorkspace}>Add to Workspace</Button>
              </div>
            </div>

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
                      User is not a member of any workspaces yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetails;

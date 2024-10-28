import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

interface ProjectUsersProps {
  projectId: string;
}

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export const ProjectUsers = ({ projectId }: ProjectUsersProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const fetchProjectUsers = async () => {
    const { data, error } = await supabase
      .from("project_users")
      .select(`
        user_id,
        profiles:profiles (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq("project_id", projectId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch project users",
        variant: "destructive",
      });
      return;
    }

    setUsers(data.map((item: any) => item.profiles));
  };

  const searchUsers = async (term: string) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%`)
      .limit(5);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive",
      });
      return;
    }

    setSearchResults(data || []);
  };

  const assignUser = async (user: User) => {
    const { error } = await supabase.from("project_users").insert({
      project_id: projectId,
      user_id: user.id,
    });

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Error",
          description: "User is already assigned to this project",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to assign user",
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Success",
      description: "User assigned to project",
    });

    setSearchTerm("");
    setSearchResults([]);
    fetchProjectUsers();
  };

  useEffect(() => {
    fetchProjectUsers();
  }, [projectId]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex -space-x-2">
        {users.map((user) => (
          <Avatar key={user.id} className="border-2 border-background">
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback>
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsSearching(true);
          }}
          onFocus={() => setIsSearching(true)}
        />
        {isSearching && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 hover:bg-muted cursor-pointer"
                onClick={() => {
                  assignUser(user);
                  setIsSearching(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback>
                      {user.first_name?.[0]}
                      {user.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span>
                    {user.first_name} {user.last_name}
                  </span>
                </div>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
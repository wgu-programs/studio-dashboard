import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useTheme } from "../theme/theme-provider";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFooter } from "./SidebarFooter";
import { type Profile } from "@/integrations/supabase/types/profiles";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => authSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Subscribe to changes in the profiles table for the current user
    const profileSubscription = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${session.user.id}`,
        },
        (payload) => {
          if (payload.new) {
            setProfile(payload.new as Profile);
          }
        }
      )
      .subscribe();

    return () => {
      profileSubscription.unsubscribe();
    };
  }, [session?.user?.id]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    if (data) setProfile(data);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
      return;
    }
    navigate("/");
  };

  return (
    <div
      className={`bg-gradient-to-b from-[#F5F5F4] to-white dark:from-sidebar-background dark:to-[#1a2436] h-screen flex flex-col border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} />

      {session && profile ? (
        <>
          <SidebarNavigation collapsed={collapsed} />
          <SidebarFooter
            collapsed={collapsed}
            profile={profile}
            onSignOut={handleSignOut}
          />
        </>
      ) : (
        <div className="flex-1 p-4">
          {!collapsed && (
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme={theme === "dark" ? "dark" : "light"}
              providers={[]}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
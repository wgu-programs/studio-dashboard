import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  Archive,
  Play,
  User,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { useTheme } from "../theme/theme-provider";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/projects", icon: Folder, label: "Projects" },
    { to: "/crawers", icon: Archive, label: "Crawers" },
    { to: "/runs", icon: Play, label: "Runs" },
    { to: "/personas", icon: User, label: "Personas" },
    { to: "/tests", icon: CheckSquare, label: "Tests" },
  ];

  return (
    <div
      className={`bg-white dark:bg-sidebar-background h-screen flex flex-col border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            WGU Studios
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-sidebar-hover rounded-lg transition-colors text-gray-500 dark:text-gray-400"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {session && profile ? (
        <>
          <nav className="flex-1 p-4 space-y-2">
            {links.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-sidebar-hover rounded-lg transition-colors"
            >
              {theme === "light" ? (
                <>
                  <Moon className="h-5 w-5" />
                  {!collapsed && <span>Dark mode</span>}
                </>
              ) : (
                <>
                  <Sun className="h-5 w-5" />
                  {!collapsed && <span>Light mode</span>}
                </>
              )}
            </button>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-2 text-sm ${
                  isActive
                    ? "bg-gray-100 dark:bg-sidebar-hover text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-sidebar-hover"
                } rounded-lg transition-colors`
              }
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {profile.first_name?.[0]}
                  {profile.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <span>
                  {profile.first_name} {profile.last_name}
                </span>
              )}
            </NavLink>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-gray-100 dark:hover:bg-sidebar-hover rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Sign out</span>}
            </button>
          </div>
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
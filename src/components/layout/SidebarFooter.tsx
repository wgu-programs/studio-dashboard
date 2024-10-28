import { NavLink } from "react-router-dom";
import { Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "../../components/theme/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarFooterProps {
  collapsed: boolean;
  profile: any;
  onSignOut: () => void;
}

export const SidebarFooter = ({ collapsed, profile, onSignOut }: SidebarFooterProps) => {
  const { theme, setTheme } = useTheme();

  const getInitials = () => {
    if (!profile) return "";
    const firstInitial = profile.first_name?.[0] || "";
    const lastInitial = profile.last_name?.[0] || "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  return (
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
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <span>
            {profile?.first_name} {profile?.last_name}
          </span>
        )}
      </NavLink>

      <button
        onClick={onSignOut}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-gray-100 dark:hover:bg-sidebar-hover rounded-lg transition-colors"
      >
        <LogOut className="h-5 w-5" />
        {!collapsed && <span>Sign out</span>}
      </button>
    </div>
  );
};
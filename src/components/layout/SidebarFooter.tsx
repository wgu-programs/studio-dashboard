import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarControls } from "./SidebarControls";

interface SidebarFooterProps {
  collapsed: boolean;
  profile: any;
  onSignOut: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const SidebarFooter = ({ 
  collapsed, 
  profile, 
  onSignOut,
  setCollapsed 
}: SidebarFooterProps) => {
  const getInitials = () => {
    if (!profile) return "";
    const firstInitial = profile.first_name?.[0] || "";
    const lastInitial = profile.last_name?.[0] || "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  return (
    <div className="mt-auto">
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `w-full flex items-center gap-3 px-4 py-2 text-sm ${
            isActive
              ? "bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-gray-300"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
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
      <SidebarControls 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onSignOut={onSignOut}
      />
    </div>
  );
};
import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarControls } from "./SidebarControls";
import { cn } from "@/lib/utils";

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
    <div className="mt-auto border-t">
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 p-3",
            isActive
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
          )
        }
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {profile?.first_name} {profile?.last_name}
            </span>
          </div>
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
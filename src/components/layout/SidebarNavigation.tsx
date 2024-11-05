import { NavLink } from "react-router-dom";
import { LayoutDashboard, Folder, Archive, Play, User, CheckSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavigationProps {
  collapsed: boolean;
}

export const SidebarNavigation = ({ collapsed }: SidebarNavigationProps) => {
  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/projects", icon: Folder, label: "Projects" },
    { to: "/crawlers", icon: Archive, label: "Crawlers" },
    { to: "/runs", icon: Play, label: "Runs" },
    { to: "/personas", icon: User, label: "Personas" },
    { to: "/tests", icon: CheckSquare, label: "Tests" },
    { to: "/users", icon: Users, label: "Users" },
  ];

  return (
    <nav className="space-y-1 px-3">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive 
                ? "bg-secondary text-secondary-foreground" 
                : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            )
          }
        >
          <Icon className="h-4 w-4" />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};
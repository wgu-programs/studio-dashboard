import { NavLink } from "react-router-dom";
import { LayoutDashboard, Folder, Archive, Play, User, CheckSquare, Users } from "lucide-react";

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
  );
};
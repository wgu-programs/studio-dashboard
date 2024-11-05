import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { LayoutDashboard, Folder, Archive, Play, User, CheckSquare, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarNavigationProps {
  collapsed: boolean;
}

export const SidebarNavigation = ({ collapsed }: SidebarNavigationProps) => {
  const navigate = useNavigate();

  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard", shortcut: "⌘1" },
    { to: "/projects", icon: Folder, label: "Projects", shortcut: "⌘2" },
    { to: "/crawlers", icon: Archive, label: "Crawlers", shortcut: "⌘3" },
    { to: "/runs", icon: Play, label: "Runs", shortcut: "⌘4" },
    { to: "/personas", icon: User, label: "Personas", shortcut: "⌘5" },
    { to: "/tests", icon: CheckSquare, label: "Tests", shortcut: "⌘6" },
    { to: "/users", icon: Users, label: "Users", shortcut: "⌘7" },
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && !event.shiftKey && !event.altKey) {
        const num = parseInt(event.key);
        if (num >= 1 && num <= links.length) {
          event.preventDefault();
          const link = links[num - 1];
          navigate(link.to);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <nav className="flex-1 p-4 space-y-2">
      {links.map(({ to, icon: Icon, label, shortcut }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""} flex justify-between`
          }
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            {!collapsed && <span>{label}</span>}
          </div>
          {!collapsed && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {shortcut}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
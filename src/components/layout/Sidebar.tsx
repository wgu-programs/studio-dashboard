import { useState } from "react";
import { NavLink } from "react-router-dom";
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
} from "lucide-react";
import { useTheme } from "../theme/theme-provider";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

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
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">WGU Studio</h1>
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
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
      </div>
    </div>
  );
};

export default Sidebar;
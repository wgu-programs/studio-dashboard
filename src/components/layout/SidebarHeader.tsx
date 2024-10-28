import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WorkspaceSelector } from "../workspace/WorkspaceSelector";

interface SidebarHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const SidebarHeader = ({ collapsed, setCollapsed }: SidebarHeaderProps) => {
  return (
    <div className="space-y-4 p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between">
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
      {!collapsed && <WorkspaceSelector />}
    </div>
  );
};
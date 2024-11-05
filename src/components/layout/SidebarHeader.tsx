import { WorkspaceSelector } from "../workspace/WorkspaceSelector";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export const SidebarHeader = ({ collapsed }: SidebarHeaderProps) => {
  return (
    <div className="space-y-4 p-4 border-b border-gray-200 dark:border-gray-800">
      {!collapsed && (
        <>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            WGU Studios
          </h1>
          <WorkspaceSelector />
        </>
      )}
    </div>
  );
};
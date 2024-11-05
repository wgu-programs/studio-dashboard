interface SidebarHeaderProps {
  collapsed: boolean;
}

export const SidebarHeader = ({ collapsed }: SidebarHeaderProps) => {
  return (
    <div className="p-4">
      {!collapsed && (
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          WGU Studio
        </h1>
      )}
    </div>
  );
};
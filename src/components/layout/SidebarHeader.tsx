interface SidebarHeaderProps {
  collapsed: boolean;
}

export const SidebarHeader = ({ collapsed }: SidebarHeaderProps) => {
  return (
    <div className="flex h-[60px] items-center px-6">
      {!collapsed && (
        <h1 className="text-lg font-semibold tracking-tight">
          WGU Studio
        </h1>
      )}
    </div>
  );
};
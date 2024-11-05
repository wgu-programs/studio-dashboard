import { LogOut, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from "../theme/theme-provider";

interface SidebarControlsProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onSignOut: () => void;
}

export const SidebarControls = ({
  collapsed,
  setCollapsed,
  onSignOut,
}: SidebarControlsProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
      <ToggleGroup type="single" className="justify-between w-full">
        <ToggleGroupItem
          value="collapse"
          onClick={() => setCollapsed(!collapsed)}
          className="data-[state=on]:bg-transparent"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </ToggleGroupItem>

        <ToggleGroupItem
          value="theme"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="data-[state=on]:bg-transparent"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </ToggleGroupItem>

        <ToggleGroupItem
          value="signout"
          onClick={onSignOut}
          className="data-[state=on]:bg-transparent text-red-500 hover:text-red-700"
        >
          <LogOut className="h-5 w-5" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
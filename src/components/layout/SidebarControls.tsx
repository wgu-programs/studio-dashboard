import { LogOut, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../theme/theme-provider";
import { cn } from "@/lib/utils";

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
    <div className="p-3 flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "h-8 w-8",
          collapsed ? "rotate-180" : ""
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {!collapsed && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-8 w-8"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onSignOut}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
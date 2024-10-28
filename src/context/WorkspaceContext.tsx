import { createContext, useContext, useState, ReactNode } from "react";

interface WorkspaceContextType {
  currentWorkspaceId: string | null;
  setCurrentWorkspaceId: (id: string | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(
    null
  );

  return (
    <WorkspaceContext.Provider
      value={{ currentWorkspaceId, setCurrentWorkspaceId }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
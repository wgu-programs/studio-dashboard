import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { WorkspaceSelector } from "../workspace/WorkspaceSelector";

const Layout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b p-4">
          <WorkspaceSelector />
        </div>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
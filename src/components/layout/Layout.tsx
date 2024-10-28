import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="space-y-2">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
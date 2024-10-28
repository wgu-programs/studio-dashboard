import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { PageHeader } from "./PageHeader";

const Layout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="space-y-6">
            <Outlet context={{ PageTitle: PageHeader }} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
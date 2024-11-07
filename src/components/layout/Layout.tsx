import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { PageHeader } from "./PageHeader";
import { withAuth } from "../auth/withAuth";

const Layout = () => {
  return (
    <div className="flex h-screen bg-background">
      <div className="bg-sidebar-background dark:bg-sidebar-background-dark">
        <Sidebar />
      </div>
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

export default withAuth(Layout);
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Breadcrumbs } from "./Breadcrumbs";

const Layout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="space-y-4">
            <Outlet context={{ PageTitle: ({ children }: { children: React.ReactNode }) => (
              <h1 className="text-4xl font-bold">{children}</h1>
            )}} />
            <Breadcrumbs />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
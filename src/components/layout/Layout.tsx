import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Breadcrumbs } from "./Breadcrumbs";

const Layout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Breadcrumbs />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
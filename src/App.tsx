import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import Users from "@/pages/Users";
import UserDetails from "@/pages/UserDetails";
import WorkspaceMemberships from "@/pages/WorkspaceMemberships";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { WorkspaceProvider } from "@/context/WorkspaceContext";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/workspaces",
        element: <WorkspaceMemberships />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/users/:userId",
        element: <UserDetails />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <WorkspaceProvider>
        <RouterProvider router={router} />
        <Toaster />
      </WorkspaceProvider>
    </ThemeProvider>
  );
}

export default App;

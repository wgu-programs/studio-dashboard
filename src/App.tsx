import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import Users from "@/pages/Users";
import UserDetails from "@/pages/UserDetails";
import WorkspaceMemberships from "@/pages/WorkspaceMemberships";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import Crawlers from "@/pages/Crawlers";
import CrawlerDetails from "@/pages/CrawlerDetails";
import Runs from "@/pages/Runs";
import RunDetails from "@/pages/RunDetails";
import Personas from "@/pages/Personas";
import PersonaDetails from "@/pages/PersonaDetails";
import PageDetails from "@/pages/PageDetails";
import Tests from "@/pages/Tests";
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
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/projects/:projectId",
        element: <ProjectDetails />,
      },
      {
        path: "/crawlers",
        element: <Crawlers />,
      },
      {
        path: "/crawlers/:crawlerId",
        element: <CrawlerDetails />,
      },
      {
        path: "/runs",
        element: <Runs />,
      },
      {
        path: "/runs/:runId",
        element: <RunDetails />,
      },
      {
        path: "/personas",
        element: <Personas />,
      },
      {
        path: "/personas/:personaId",
        element: <PersonaDetails />,
      },
      {
        path: "/pages/:pageId",
        element: <PageDetails />,
      },
      {
        path: "/tests",
        element: <Tests />,
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
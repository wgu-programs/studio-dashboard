import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme/theme-provider";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Crawlers from "./pages/Crawlers";
import Runs from "./pages/Runs";
import Personas from "./pages/Personas";
import Tests from "./pages/Tests";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import NewUser from "./pages/NewUser";

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <WorkspaceProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetails />} />
            <Route path="/crawlers" element={<Crawlers />} />
            <Route path="/runs" element={<Runs />} />
            <Route path="/personas" element={<Personas />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/new" element={<NewUser />} />
            <Route path="/users/:userId" element={<UserDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WorkspaceProvider>
  </ThemeProvider>
);

export default App;
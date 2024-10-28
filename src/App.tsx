import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Crawers from "./pages/Crawers";
import Runs from "./pages/Runs";
import Personas from "./pages/Personas";
import Tests from "./pages/Tests";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/crawers" element={<Crawers />} />
        <Route path="/runs" element={<Runs />} />
        <Route path="/personas" element={<Personas />} />
        <Route path="/tests" element={<Tests />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
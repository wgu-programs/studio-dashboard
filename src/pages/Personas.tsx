import { useOutletContext } from "react-router-dom";

const Personas = () => {
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  return (
    <div className="space-y-4">
      <PageTitle>Personas</PageTitle>
    </div>
  );
};

export default Personas;
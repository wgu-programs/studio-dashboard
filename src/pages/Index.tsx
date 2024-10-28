import { useOutletContext } from "react-router-dom";

const Index = () => {
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  return (
    <div className="space-y-4">
      <PageTitle>Dashboard</PageTitle>
    </div>
  );
};

export default Index;
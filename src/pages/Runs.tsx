import { useOutletContext } from "react-router-dom";

const Runs = () => {
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  return (
    <div className="space-y-4">
      <PageTitle>Runs</PageTitle>
    </div>
  );
};

export default Runs;
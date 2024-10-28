import { useOutletContext } from "react-router-dom";

const Tests = () => {
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  return (
    <div className="space-y-4">
      <PageTitle>Tests</PageTitle>
    </div>
  );
};

export default Tests;
import { useOutletContext } from "react-router-dom";

const Crawers = () => {
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  return (
    <div className="space-y-4">
      <PageTitle>Crawlers</PageTitle>
    </div>
  );
};

export default Crawers;
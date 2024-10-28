import { Breadcrumbs } from "./Breadcrumbs";

interface PageHeaderProps {
  children: React.ReactNode;
}

export const PageHeader = ({ children }: PageHeaderProps) => {
  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-bold">{children}</h1>
      <Breadcrumbs />
    </div>
  );
};
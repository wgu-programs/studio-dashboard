import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Tests = () => {
  const { PageTitle } = useOutletContext<{
    PageTitle: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  return (
    <div className="space-y-4">
      <PageTitle>Tests</PageTitle>
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No tests have been run yet.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tests;
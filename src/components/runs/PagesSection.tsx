import React from 'react';
import { Page } from '@/integrations/supabase/types/pages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PagesTable } from './PagesTable';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface PagesSectionProps {
  runId: string;
}

export const PagesSection = ({ runId }: PagesSectionProps) => {
  const { data: pages, isLoading } = useQuery({
    queryKey: ['pages', runId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('run_id', runId);

      if (error) {
        throw error;
      }

      return data as Page[];
    },
  });

  const completedPages = pages?.filter((page) => page.status === 'completed') ?? [];
  const pendingPages = pages?.filter((page) => page.status === 'pending') ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Completed Pages ({completedPages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <PagesTable pages={completedPages} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Pages ({pendingPages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <PagesTable pages={pendingPages} />
        </CardContent>
      </Card>
    </div>
  );
};
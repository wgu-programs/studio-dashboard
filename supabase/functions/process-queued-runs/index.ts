import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Find runs that are queued or processing
    const { data: queuedRuns, error: runsError } = await supabase
      .from('runs')
      .select('*')
      .in('status', ['queued', 'processing'])
      .order('started_at', { ascending: true });

    if (runsError) {
      throw runsError;
    }

    console.log(`Found ${queuedRuns?.length || 0} queued/processing runs`);

    // Process each run
    for (const run of queuedRuns || []) {
      console.log(`Processing run ${run.run_id}`);

      // Update run status to processing if it was queued
      if (run.status === 'queued') {
        await supabase
          .from('runs')
          .update({ status: 'processing' })
          .eq('run_id', run.run_id);
      }

      // Get all unprocessed pages for this run
      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .eq('run_id', run.run_id)
        .is('status', null);

      if (pagesError) {
        console.error(`Error fetching pages for run ${run.run_id}:`, pagesError);
        continue;
      }

      console.log(`Found ${pages?.length || 0} unprocessed pages for run ${run.run_id}`);

      // Process each page
      for (const page of pages || []) {
        // Skip processing if the run status has changed
        const { data: currentRun } = await supabase
          .from('runs')
          .select('status')
          .eq('run_id', run.run_id)
          .single();

        if (currentRun?.status === 'paused' || currentRun?.status === 'cancelled') {
          console.log(`Run ${run.run_id} was ${currentRun.status}, skipping remaining pages`);
          break;
        }

        // Trigger the crawl-page function for each page
        const response = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/crawl-page`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            },
            body: JSON.stringify({ pageId: page.page_id }),
          }
        );

        if (!response.ok) {
          console.error(`Failed to process page ${page.page_id}: ${await response.text()}`);
        }

        // Add a small delay between requests to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Check if all pages are processed and update run status accordingly
      const { data: remainingPages } = await supabase
        .from('pages')
        .select('page_id, status')
        .eq('run_id', run.run_id);

      const allPagesCompleted = remainingPages?.every(page => page.status === 'completed');
      
      if (allPagesCompleted && remainingPages?.length > 0) {
        // Use UTC timestamp for completed_at
        const completed_at = new Date().toISOString();
        await supabase
          .from('runs')
          .update({ 
            status: 'completed',
            completed_at
          })
          .eq('run_id', run.run_id);
        console.log(`Run ${run.run_id} completed at ${completed_at}`);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing queued runs:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
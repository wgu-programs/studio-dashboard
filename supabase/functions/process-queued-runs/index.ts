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

    console.log('Starting process-queued-runs function');

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
        const { error: updateError } = await supabase
          .from('runs')
          .update({ status: 'processing' })
          .eq('run_id', run.run_id);

        if (updateError) {
          console.error(`Error updating run status: ${updateError.message}`);
          continue;
        }
      }

      // Get all queued pages for this run
      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .eq('run_id', run.run_id)
        .eq('status', 'queued');

      if (pagesError) {
        console.error(`Error fetching pages for run ${run.run_id}:`, pagesError);
        continue;
      }

      console.log(`Found ${pages?.length || 0} queued pages for run ${run.run_id}`);

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

        // Update page status to processing
        const { error: pageUpdateError } = await supabase
          .from('pages')
          .update({ status: 'processing' })
          .eq('page_id', page.page_id);

        if (pageUpdateError) {
          console.error(`Error updating page status: ${pageUpdateError.message}`);
          continue;
        }

        // Invoke the crawl-page function for each page
        console.log(`Invoking crawl-page function for page ${page.page_id} with URL ${page.url}`);
        
        try {
          const { data: response, error: invokeError } = await supabase.functions.invoke('crawl-page', {
            body: { record: { page_id: page.page_id, url: page.url } }
          });

          if (invokeError) {
            console.error(`Failed to invoke crawl-page for page ${page.page_id}:`, invokeError);
            
            // Update page status to failed
            await supabase
              .from('pages')
              .update({ status: 'failed' })
              .eq('page_id', page.page_id);
              
            continue;
          }

          console.log(`Successfully invoked crawl-page for page ${page.page_id}:`, response);
        } catch (error) {
          console.error(`Error invoking crawl-page for page ${page.page_id}:`, error);
          
          // Update page status to failed
          await supabase
            .from('pages')
            .update({ status: 'failed' })
            .eq('page_id', page.page_id);
        }

        // Add a small delay between requests to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Check if all pages are processed and update run status accordingly
      const { data: remainingPages } = await supabase
        .from('pages')
        .select('page_id, status')
        .eq('run_id', run.run_id);

      const allPagesCompleted = remainingPages?.every(page => 
        page.status === 'completed' || page.status === 'failed'
      );
      
      if (allPagesCompleted && remainingPages?.length > 0) {
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
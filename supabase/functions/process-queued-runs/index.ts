import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    console.log('Starting to process queued runs...');

    // Get all queued runs that aren't cancelled
    const { data: queuedRuns, error: runsError } = await supabase
      .from('runs')
      .select('run_id')
      .eq('status', 'queued');

    if (runsError) throw runsError;

    console.log(`Found ${queuedRuns?.length || 0} queued runs`);

    for (const run of queuedRuns || []) {
      // Get unprocessed pages for this run
      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select('page_id, url')
        .eq('run_id', run.run_id)
        .eq('status', 'queued');

      if (pagesError) throw pagesError;

      console.log(`Processing ${pages?.length || 0} pages for run ${run.run_id}`);

      // Process each page
      for (const page of pages || []) {
        // Trigger the crawl-page function for each page
        const response = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/crawl-page`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            },
            body: JSON.stringify({ record: page }),
          }
        );

        if (!response.ok) {
          console.error(`Failed to process page ${page.page_id}: ${await response.text()}`);
        }
      }

      // If all pages are processed, update run status
      if (pages?.length === 0) {
        const { error: updateError } = await supabase
          .from('runs')
          .update({ status: 'completed', completed_at: new Date().toISOString() })
          .eq('run_id', run.run_id);

        if (updateError) {
          console.error(`Failed to update run status: ${updateError.message}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'Successfully processed queued runs' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing queued runs:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
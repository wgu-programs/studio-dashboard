/******************************************************************************
 * @Author                : David Petersen <david.petersen@wgu.edu>           *
 * @CreatedDate           : 2024-10-30 13:27:46                               *
 * @LastEditors           : David Petersen <david.petersen@wgu.edu>           *
 * @LastEditDate          : 2024-10-30 13:27:46                               *
 * @FilePath              : studio-dashboard/supabase/functions/crawl-page/index.ts*
 * @CopyRight             : Western Governors University                      *
 *****************************************************************************/

import { createClient } from 'https://deno.land/x/supabase@1.0.0/mod.ts';
import { serve } from 'https://deno.land/x/sift@0.5.0/mod.ts';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { url } = await req.json();
  if (!url) {
    return new Response('Bad Request: URL is required', { status: 400 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: apiKey, error } = await supabase
    .from('secrets')
    .select('value')
    .eq('key', 'x-api-key')
    .single();

  if (error) {
    return new Response('Error fetching API key', { status: 500 });
  }

  const response = await fetch('https://up2qwjbpe3.execute-api.us-east-1.amazonaws.com/dev/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey.value,
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    return new Response('Error fetching page data', { status: response.status });
  }

  const result = await response.json();

  // Assuming you have a way to update the page with the results
  // This part is highly dependent on your specific implementation
  // For example, you might store the results in a database or update a frontend component

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
});
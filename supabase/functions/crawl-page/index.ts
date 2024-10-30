/******************************************************************************
 * @Author                : David Petersen <david.petersen@wgu.edu>           *
 * @CreatedDate           : 2024-10-30 14:54:37                               *
 * @LastEditors           : David Petersen <david.petersen@wgu.edu>           *
 * @LastEditDate          : 2024-10-30 14:54:37                               *
 * @FilePath              : studio-dashboard/supabase/functions/crawl-page/index.ts*
 * @CopyRight             : Western Governors University                      *
 *****************************************************************************/

// @deno-types="https://raw.githubusercontent.com/denoland/deno/v1.37.2/cli/dts/lib.deno.ns.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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
    .from('vault')
    .select('value')
    .eq('key', 'aws-api-gateway-key')
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

  // Convert base64 screenshot to Uint8Array
  const screenshotBinary = Uint8Array.from(atob(result.screenshot), c => c.charCodeAt(0));

  // Upload screenshot to storage
  const screenshotPath = `screenshots/${Date.now()}.png`;
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('pages')
    .upload(screenshotPath, screenshotBinary, {
      contentType: 'image/png',
      upsert: true
    });

  if (uploadError) {
    return new Response('Error uploading screenshot', { status: 500 });
  }

  // Get public URL for the screenshot
  const { data: { publicUrl: screenshotUrl } } = supabase
    .storage
    .from('pages')
    .getPublicUrl(screenshotPath);

  // Update the page record
  const { error: updateError } = await supabase
    .from('pages')
    .update({
      title: result.title,
      description: result.description,
      html: result.html,
      screenshot_url: screenshotUrl,
    })
    .eq('url', url);

  if (updateError) {
    return new Response('Error updating page record', { status: 500 });
  }

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
});
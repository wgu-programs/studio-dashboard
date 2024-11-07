/******************************************************************************
 * @Author                : David Petersen <david.petersen@wgu.edu>           *
 * @CreatedDate           : 2024-10-30 15:52:23                               *
 * @LastEditors           : David Petersen <david.petersen@wgu.edu>           *
 * @LastEditDate          : 2024-10-31 11:50:13                               *
 * @FilePath              : studio-dashboard/supabase/functions/crawl-page/index.ts*
 * @CopyRight             : Western Governors University                      *
 *****************************************************************************/

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const handler = async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { record } = await req.json();
  console.log('Record:', record);

  const { page_id, url } = record;
  if (!page_id || !url) {
    return new Response('Bad Request: Page ID and URL are required', {
      status: 400,
    });
  }

  if (!url) {
    return new Response('Bad Request: URL is required', { status: 400 });
  }


  const pageResponse = await fetch('https://up2qwjbpe3.execute-api.us-east-1.amazonaws.com/dev/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': Deno.env.get('AWS_API_GATEWAY_KEY')!,
    },

    body: JSON.stringify({ "commands": [{ "action": "get", "params": [url] }, { "action": "manage().window().maximize", "params": [] }, { "action": "takeScreenshot", "params": [] }] }),

  });


  if (!pageResponse.ok) {
    return new Response('Error fetching page data', { status: pageResponse.status });
  }


  const pageData = await pageResponse.json();
  console.log(pageData);
  const screenshotBinary = Uint8Array.from(atob(pageData.screenshot), c => c.charCodeAt(0));
  const screenshotPath = `${Date.now()}.png`;
  console.log("Screenshot File:", screenshotPath);


  const { error: uploadError } = await supabase.storage
    .from('page-screenshots')
    .upload(screenshotPath, screenshotBinary, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    console.log('Error: ', uploadError);
    return new Response('Error uploading screenshot', { status: 500 });
  }

  const { data: { publicUrl: screenshotUrl } } = await supabase.storage
    .from('page-screenshots')
    .getPublicUrl(screenshotPath);


  if (screenshotUrl) {
    console.log("Screenshot URL: ", screenshotUrl)
  };

  const { error: updateError } = await supabase
    .from('pages')
    .update({
      description: pageData.description,
      html: pageData.html,
      screenshot_url: screenshotUrl,
      date_modified: new Date().toISOString(),
      status: 'completed'
    })
    .eq('page_id', page_id);

  if (updateError) {
    console.error('Error updating page record:', updateError);
    return new Response('Error updating page record', { status: 500 });
  }

  return new Response(JSON.stringify(pageData), {
    headers: { 'Content-Type': 'application/json' },
  });

};

serve(handler);
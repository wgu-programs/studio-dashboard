/******************************************************************************
 * @Author                : David Petersen <david.petersen@wgu.edu>           *
 * @CreatedDate           : 2024-10-29 14:34:18                               *
 * @LastEditors           : David Petersen <david.petersen@wgu.edu>           *
 * @LastEditDate          : 2024-10-29 14:44:12                               *
 * @FilePath              : studio-dashboard/supabase/functions/crawl-page/index.ts*
 * @CopyRight             : Western Governors University                      *
 *****************************************************************************/

import { captureScreenshot } from "https://deno.land/x/hvb_screenshots/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 800;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const getUrlFromRequest = async (req: Request) => {
  const body = await req.json();
  return body?.record?.url;
};

const takeScreenshot = async (url: string) => {
  // Capture screenshot using hvb-screenshots
  const screenshot = await captureScreenshot(url, {
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT,
    format: "jpeg",
    quality: 80,
    fullPage: true,
  });

  return screenshot;
};

const uploadScreenshot = async (screenshot: Uint8Array, filename: string) => {
  const { error: uploadError } = await supabase.storage
    .from('snapshots')
    .upload(filename, screenshot, { contentType: 'image/jpeg', upsert: true });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('snapshots').getPublicUrl(filename);
  return data?.publicUrl;
};

const fetchPageData = async (url: string) => {
  const response = await fetch(url);
  const html = await response.text();

  // Parse HTML for title and description if needed
  const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? null;
  const descriptionMatch = html.match(/<meta name="description" content="(.*?)">/);
  const description = descriptionMatch ? descriptionMatch[1] : null;

  return { title, description, html };
};

const updatePageRecord = async (url: string, data: any) => {
  const { error } = await supabase
    .from('pages')
    .update(data)
    .eq('url', url);
  if (error) throw error;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const url = await getUrlFromRequest(req);
    if (!url) throw new Error('No URL provided in either content-type header or request body');

    const screenshot = await takeScreenshot(url);

    const timestamp = new Date().getTime();
    const filename = `${timestamp}.jpg`;
    const publicUrl = await uploadScreenshot(screenshot, filename);

    const { title, description, html } = await fetchPageData(url);
    await updatePageRecord(url, { title, description, html, snapshot_url: publicUrl, status: 'completed' });

    return new Response(JSON.stringify({ success: true, url: publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing page:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

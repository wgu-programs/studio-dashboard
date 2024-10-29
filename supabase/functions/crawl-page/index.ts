/******************************************************************************
 * @Author                : David Petersen <david.petersen@wgu.edu>           *
 * @CreatedDate           : 2024-10-29 14:06:11                               *
 * @LastEditors           : David Petersen <david.petersen@wgu.edu>           *
 * @LastEditDate          : 2024-10-29 14:06:11                               *
 * @FilePath              : studio-dashboard/supabase/functions/crawl-page/index.ts*
 * @CopyRight             : Western Governors University                      *
 *****************************************************************************/

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
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
  const contentType = req.headers.get('content-type');
  const urlMatch = contentType?.match(/url=([^;]+)/);
  const body = await req.json()?.record;
  return urlMatch ? decodeURIComponent(urlMatch[1]) : body?.url;
};

const launchBrowserAndPage = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT });
  return { browser, page };
};

const captureScreenshot = async (page: any, url: string) => {
  await page.goto(url, { waitUntil: 'networkidle0' });
  return page.screenshot({ type: 'jpeg', quality: 80, fullPage: true });
};

const uploadScreenshot = async (screenshot: Buffer, filename: string) => {
  const { error: uploadError } = await supabase.storage
    .from('snapshots')
    .upload(filename, screenshot, { contentType: 'image/jpeg', upsert: true });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('snapshots').getPublicUrl(filename);
  return data?.publicUrl;
};

const fetchPageData = async (page: any) => {
  const [title, description, html] = await Promise.all([
    page.title(),
    page.$eval('meta[name="description"]', el => el.getAttribute('content')).catch(() => null),
    page.content(),
  ]);
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

    const { browser, page } = await launchBrowserAndPage();
    const screenshot = await captureScreenshot(page, url);

    const timestamp = new Date().getTime();
    const filename = `${timestamp}.jpg`;
    const publicUrl = await uploadScreenshot(screenshot, filename);

    const { title, description, html } = await fetchPageData(page);
    await updatePageRecord(url, { title, description, html, snapshot_url: publicUrl, status: 'completed' });

    await browser.close();

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

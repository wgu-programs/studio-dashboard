import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const body = await req.json();
    console.log('Received request body:', body);

    // Extract URL from content-type header
    const contentType = req.headers.get('content-type');
    const urlMatch = contentType?.match(/url=([^;]+)/);
    const url = urlMatch ? decodeURIComponent(urlMatch[1]) : body.url;

    if (!url) {
      throw new Error('No URL provided in either content-type header or request body');
    }

    console.log('Processing URL:', url);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Launch browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set viewport for consistent snapshots
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('Navigating to URL:', url);
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Take screenshot
    const screenshot = await page.screenshot({ 
      type: 'jpeg',
      quality: 80,
      fullPage: true 
    });

    // Upload screenshot to storage
    const timestamp = new Date().getTime();
    const filename = `${timestamp}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('snapshots')
      .upload(filename, screenshot, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('snapshots')
      .getPublicUrl(filename);

    // Get page content and metadata
    const title = await page.title();
    const description = await page.$eval(
      'meta[name="description"]',
      (element) => element.getAttribute('content')
    ).catch(() => null);
    
    const html = await page.content();

    // Update page in database
    const { error: updateError } = await supabase
      .from('pages')
      .update({
        title,
        description,
        html,
        snapshot_url: publicUrl,
        status: 'completed'
      })
      .eq('url', url);

    if (updateError) throw updateError;

    // Close browser
    await browser.close();

    console.log('Successfully processed page:', url);

    return new Response(
      JSON.stringify({ success: true, url: publicUrl }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error processing page:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});
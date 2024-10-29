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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Subscribe to queued pages
    const subscription = supabase
      .channel('queued-pages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pages',
          filter: 'status=eq.queued'
        },
        async (payload) => {
          console.log('New queued page:', payload);
          const page = payload.new;

          try {
            // Launch browser
            const browser = await puppeteer.launch();
            const browserPage = await browser.newPage();
            
            // Set viewport for consistent snapshots
            await browserPage.setViewport({ width: 1280, height: 800 });
            
            // Navigate to URL
            await browserPage.goto(page.url, { waitUntil: 'networkidle0' });
            
            // Take screenshot
            const screenshot = await browserPage.screenshot({ 
              type: 'jpeg',
              quality: 80,
              fullPage: true 
            });

            // Upload screenshot to storage
            const timestamp = new Date().getTime();
            const filename = `${page.page_id}-${timestamp}.jpg`;
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
            const title = await browserPage.title();
            const description = await browserPage.$eval(
              'meta[name="description"]',
              (element) => element.getAttribute('content')
            ).catch(() => null);
            
            const html = await browserPage.content();

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
              .eq('page_id', page.page_id);

            if (updateError) throw updateError;

            // Close browser
            await browser.close();

          } catch (error) {
            console.error('Error processing page:', error);
            
            // Update page status to error
            await supabase
              .from('pages')
              .update({
                status: 'error',
                description: error.message
              })
              .eq('page_id', page.page_id);
          }
        }
      )
      .subscribe();

    return new Response(
      JSON.stringify({ message: 'Subscription started successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { url, crawler_id, run_id } = await req.json();

    // Validate required parameters
    if (!url) {
      throw new Error('Missing required parameter: url');
    }

    console.log(`Processing page: ${url}`);
    console.log(`Crawler ID: ${crawler_id}`);
    console.log(`Run ID: ${run_id}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the page content
    const response = await fetch(url);
    const html = await response.text();

    // Extract metadata using regex patterns
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;

    const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
    const description = descriptionMatch ? descriptionMatch[1].trim() : null;

    const authorMatch = html.match(/<meta[^>]*name="author"[^>]*content="([^"]*)"[^>]*>/i);
    const author = authorMatch ? authorMatch[1].trim() : null;

    // Update the page record with the fetched content
    const { data, error } = await supabase
      .from('pages')
      .update({
        title,
        description,
        author,
        html,
        status: 'completed',
      })
      .eq('url', url)
      .eq('crawler_id', crawler_id)
      .eq('run_id', run_id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log(`Successfully processed page: ${url}`);
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing page:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
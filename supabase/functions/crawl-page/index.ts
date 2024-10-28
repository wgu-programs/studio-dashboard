import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('Received request:', req.method);
    const body = await req.json();
    console.log('Request body:', body);

    // Validate required parameters
    if (!body.url) {
      throw new Error('Missing required parameter: url');
    }

    const { url, crawler_id, run_id } = body;

    console.log(`Processing page: ${url}`);
    console.log(`Crawler ID: ${crawler_id}`);
    console.log(`Run ID: ${run_id}`);

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

    return new Response(
      JSON.stringify({
        title,
        description,
        author,
        html,
        status: 'completed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error processing page:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
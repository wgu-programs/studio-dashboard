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
    // Log the raw request for debugging
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    console.log('Request method:', req.method);
    
    const body = await req.json();
    console.log('Request body (raw):', JSON.stringify(body, null, 2));
    
    // Validate required parameters
    if (!body.url) {
      console.error('Missing URL in request body:', body);
      throw new Error('Missing required parameter: url');
    }

    const { url, crawler_id, run_id } = body;

    console.log(`Processing page: ${url}`);
    console.log(`Crawler ID: ${crawler_id}`);
    console.log(`Run ID: ${run_id}`);

    // Fetch the page content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();

    // Extract metadata using regex patterns
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;

    const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
    const description = descriptionMatch ? descriptionMatch[1].trim() : null;

    const authorMatch = html.match(/<meta[^>]*name="author"[^>]*content="([^"]*)"[^>]*>/i);
    const author = authorMatch ? authorMatch[1].trim() : null;

    const result = {
      title,
      description,
      author,
      html,
      status: 'completed'
    };
    
    console.log('Response payload:', JSON.stringify({
      title,
      description,
      author,
      status: 'completed',
      htmlLength: html?.length || 0
    }, null, 2));

    return new Response(
      JSON.stringify(result),
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
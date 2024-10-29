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
    // Log the request details for debugging
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    console.log('Request method:', req.method);

    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);

    let body;
    try {
      // Try parsing the raw body as JSON
      body = JSON.parse(rawBody);
      console.log('Parsed request body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      // If JSON parsing fails, try to parse the content-type header as a fallback
      const contentType = req.headers.get('content-type');
      if (contentType && contentType.startsWith('{')) {
        try {
          body = JSON.parse(contentType);
          console.log('Parsed from content-type header:', JSON.stringify(body, null, 2));
        } catch (headerParseError) {
          console.error('Error parsing content-type header:', headerParseError);
          return new Response(
            JSON.stringify({ error: 'Invalid request format' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }
    
    // Validate required parameters
    if (!body?.url) {
      console.error('Missing URL in request body:', body);
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: url' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
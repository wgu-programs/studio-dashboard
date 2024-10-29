-- Supabase AI is experimental and may produce incorrect answers
-- Always verify the output before executing

create
or replace function public.handle_new_page () returns trigger language plpgsql security definer as $$
declare
  response_status int;
  payload text;
begin
  -- Create the payload as a JSON object
  payload := json_build_object(
    'url', NEW.url,
    'crawler_id', NEW.crawler_id,
    'run_id', NEW.run_id,
    'status', NEW.status
  )::text;

  -- Log the payload for debugging
  RAISE NOTICE 'Sending payload: %', payload;

  -- Only trigger the edge function if we have a URL
  IF NEW.url IS NULL THEN
    RAISE WARNING 'Skipping edge function call: URL is null';
    RETURN NEW;
  END IF;

  SELECT
    status INTO response_status
  FROM
    extensions.http(
      'POST',
      'https://tntmojiyzugsvimxcflp.supabase.co/functions/v1/crawl-page',
      ARRAY[
        http_header('Content-Type', 'application/json'),
        http_header('Authorization', 'Bearer ...')
      ],
      payload,
      5000  -- timeout in milliseconds
    );
  if response_status != 200 then
    raise warning 'HTTP request failed with status %', response_status;
  end if;

  return NEW;
end;
$$;
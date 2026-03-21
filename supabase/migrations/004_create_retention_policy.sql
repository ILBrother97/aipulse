-- Create function to archive old usage events
CREATE OR REPLACE FUNCTION archive_usage_events()
RETURNS void AS $$
BEGIN
  INSERT INTO usage_events_archive
  SELECT * FROM usage_events
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  DELETE FROM usage_events
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

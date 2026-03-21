CREATE MATERIALIZED VIEW daily_usage_stats AS
SELECT 
  DATE(created_at) as date,
  feature_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users
FROM usage_events
GROUP BY DATE(created_at), feature_type;

CREATE UNIQUE INDEX idx_daily_stats ON daily_usage_stats(date, feature_type);

CREATE MATERIALIZED VIEW monthly_usage_stats AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  feature_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users
FROM usage_events
GROUP BY DATE_TRUNC('month', created_at), feature_type;

CREATE UNIQUE INDEX idx_monthly_stats ON monthly_usage_stats(month, feature_type);

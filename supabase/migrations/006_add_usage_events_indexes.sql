CREATE INDEX IF NOT EXISTS idx_usage_events_user_feature ON usage_events(user_id, feature_type);
CREATE INDEX IF NOT EXISTS idx_usage_events_created_at ON usage_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_events_type ON usage_events(event_type);

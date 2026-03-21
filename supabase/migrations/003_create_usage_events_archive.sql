CREATE TABLE usage_events_archive (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  feature_type TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_events_archive_user_id ON usage_events_archive(user_id);
CREATE INDEX idx_usage_events_archive_created_at ON usage_events_archive(created_at);

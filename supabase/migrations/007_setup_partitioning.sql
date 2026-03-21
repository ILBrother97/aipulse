-- Enable partitioning (for future use with large datasets)
-- This requires PostgreSQL 10+

-- Example for monthly partitioning of usage_events:
-- CREATE TABLE usage_events_partitioned (
--   LIKE usage_events INCLUDING ALL
-- ) PARTITION BY RANGE (created_at);

-- For now, add a partition strategy comment
COMMENT ON TABLE usage_events IS 'Consider partitioning by month for large datasets';

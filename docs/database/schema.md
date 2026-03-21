# Database Schema

## Tables

### user_usage
Tracks feature usage per user per day.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to auth.users |
| feature_type | TEXT | Feature identifier |
| usage_count | INTEGER | Number of uses today |
| reset_date | DATE | Date for daily reset |
| created_at | TIMESTAMP | Record creation time |

### webhook_logs
Logs all webhook processing events.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| event_type | TEXT | Stripe event type |
| status | TEXT | pending/processed/failed |
| retry_count | INTEGER | Number of retries |
| error_message | TEXT | Error if failed |

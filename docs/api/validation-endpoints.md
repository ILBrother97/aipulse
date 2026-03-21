# Usage Validation API

## POST /functions/v1/validate-usage

Validates if a user can access a premium feature.

### Request Body
```json
{
  "userId": "uuid",
  "feature": "ai_queries" | "collections" | "workflows"
}
```

### Response
```json
{
  "allowed": true | false,
  "isPremium": true | false,
  "currentUsage": 0,
  "limit": 1
}
```

## POST /functions/v1/increment-usage

Increments usage count for a feature.

### Request Body
```json
{
  "userId": "uuid",
  "feature": "ai_queries"
}
```

### Response
```json
{
  "success": true
}
```

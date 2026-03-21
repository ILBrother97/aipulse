# Troubleshooting Guide

## Premium Features Not Working

1. Check user subscription status in profiles table
2. Verify webhook processing in webhook_logs
3. Check rate limiting hasn't blocked the user
4. Review audit logs for access denials

## High Latency Issues

1. Check premium cache hit rate
2. Review database query performance
3. Verify Redis/edge cache is working
4. Check for database connection pool exhaustion

## Webhook Failures

1. Check webhook_logs for error messages
2. Verify Stripe webhook signature
3. Review dead letter queue
4. Manually retry failed webhooks

# Stripe Webhook Setup for AIPulse

## 1. Deploy the Supabase Edge Function

### Prerequisites
- Install Supabase CLI: `npm install -g supabase`
- Link your project: `supabase link --project-ref YOUR_PROJECT_REF`

### Deploy Command
```bash
supabase functions deploy stripe-webhook
```

## 2. Environment Variables (Set in Supabase Dashboard)

Go to your Supabase project dashboard → Settings → Edge Functions and set these variables:

```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
SUPABASE_URL=https://your-project-ref.supabase.co
SERVICE_ROLE_KEY=your-service-role-key
```

**Important:** Use your live keys for production, test keys for development.

## 3. Configure Stripe Webhook

### Get the Webhook URL
After deploying, your webhook URL will be:
```
https://your-project-ref.supabase.co/functions/v1/stripe-webhook
```

### Add Webhook in Stripe Dashboard
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Paste the webhook URL
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add it to your environment variables

## 4. Local Testing with Stripe CLI

### Install Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Or download from https://stripe.com/docs/stripe-cli
```

### Login to Stripe
```bash
stripe login
```

### Forward Webhooks Locally
```bash
# Start your Supabase local development
supabase start

# Forward webhooks to your local function
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
```

### Test Events
```bash
# Test a completed checkout
stripe trigger checkout.session.completed

# Test a subscription deletion
stripe trigger customer.subscription.deleted

# Test a payment failure
stripe trigger invoice.payment_failed
```

## 5. Testing Checklist

### Before Production
- [ ] Deploy function to Supabase
- [ ] Set all environment variables
- [ ] Configure webhook in Stripe dashboard
- [ ] Test with Stripe CLI locally
- [ ] Test with a real checkout session

### Testing Scenarios
1. **New Subscription**: Complete checkout → verify user becomes premium
2. **Subscription Cancellation**: Delete subscription → verify user loses premium
3. **Payment Failure**: Trigger failed payment → verify warning is logged

## 6. Monitoring

### Check Function Logs
```bash
supabase functions logs stripe-webhook --follow
```

### Common Issues
- **400 Bad Request**: Check webhook signature verification
- **500 Internal Error**: Check database connection and environment variables
- **Missing events**: Verify webhook configuration in Stripe dashboard

## 7. Security Notes

- Always verify webhook signatures
- Use service role key for admin operations
- Never expose secret keys in client code
- Monitor webhook delivery in Stripe dashboard

## 8. Production Deployment

1. Use live Stripe keys
2. Enable webhook retries in Stripe settings
3. Set up monitoring for failed webhooks
4. Consider implementing retry logic for database operations

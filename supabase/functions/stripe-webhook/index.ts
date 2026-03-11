import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the signature from headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      console.error('No stripe-signature header found')
      return new Response('No signature', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    // Get the webhook secret from environment
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return new Response('Webhook secret not configured', { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Get the raw body for signature verification
    const body = await req.text()
    
    // Verify the webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response('Invalid signature', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    )

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id
        const stripeCustomerId = session.customer as string

        if (!userId || !stripeCustomerId) {
          console.error('Missing userId or stripeCustomerId in checkout session')
          return new Response('Missing required data', { 
            status: 400, 
            headers: corsHeaders 
          })
        }

        console.log(`Upgrading user ${userId} to premium`)

        // Update user profile to premium
        const { error } = await supabaseAdmin
          .from('profiles')
          .update({ 
            is_premium: true, 
            stripe_customer_id: stripeCustomerId 
          })
          .eq('id', userId)

        if (error) {
          console.error('Error updating profile:', error)
          return new Response('Database error', { 
            status: 500, 
            headers: corsHeaders 
          })
        }

        console.log(`Successfully upgraded user ${userId} to premium`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const stripeCustomerId = subscription.customer as string

        if (!stripeCustomerId) {
          console.error('Missing stripeCustomerId in subscription deletion')
          return new Response('Missing customer ID', { 
            status: 400, 
            headers: corsHeaders 
          })
        }

        console.log(`Downgrading customer ${stripeCustomerId} from premium`)

        // Update user profile to non-premium
        const { error } = await supabaseAdmin
          .from('profiles')
          .update({ is_premium: false })
          .eq('stripe_customer_id', stripeCustomerId)

        if (error) {
          console.error('Error downgrading profile:', error)
          return new Response('Database error', { 
            status: 500, 
            headers: corsHeaders 
          })
        }

        console.log(`Successfully downgraded customer ${stripeCustomerId} from premium`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const stripeCustomerId = invoice.customer as string

        console.warn(`Payment failed for customer ${stripeCustomerId}, invoice ${invoice.id}`)
        // Note: We don't downgrade immediately - you might want to implement a grace period
        // or handle dunning emails through Stripe's built-in features
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response('Webhook processed', { 
      status: 200, 
      headers: corsHeaders 
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response('Internal server error', { 
      status: 500, 
      headers: corsHeaders 
    })
  }
})

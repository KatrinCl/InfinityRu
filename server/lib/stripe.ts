import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY

export const stripe = stripeSecretKey && stripePublishableKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2026-04-22.dahlia',
    })
  : null

export const isStripeConfigured = stripe !== null

if (!isStripeConfigured && process.env.NODE_ENV === 'production') {
  console.warn('⚠️  Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY in .env')
}

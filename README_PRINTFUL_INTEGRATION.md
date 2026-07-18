# Galito — Printful + Stripe integration (MVP)

This branch adds a minimal Next.js e-commerce integration that connects your Printful store and Stripe Checkout.

Files added (MVP):
- pages/products.js — product listing page
- pages/product/[id].js — product detail + add to cart
- pages/cart.js — client cart and checkout
- pages/api/printful/products.js — server proxy to Printful products
- pages/api/stripe/create-session.js — creates Stripe Checkout session
- pages/api/webhooks/stripe.js — Stripe webhook handler that creates Printful order on successful payment
- .env.example — required environment variables

Important notes
- This is an MVP. The server uses an in-memory Map to store carts for the webhook flow — for production use a persistent store (Redis, Postgres).
- Do NOT commit your secrets. Set PRINTFUL_API_KEY, STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_BASE_URL in your deployment environment (Vercel or other).

Local testing
1. npm install
2. Create .env.local from .env.example
3. npm run dev
4. Use Stripe CLI to forward webhooks locally:
   stripe listen --forward-to localhost:3000/api/webhooks/stripe

Deploy
- Deploy to Vercel and set env vars in the Vercel dashboard. Register the Stripe webhook endpoint in the Stripe Dashboard (https://your-site.vercel.app/api/webhooks/stripe) and paste the signing secret into STRIPE_WEBHOOK_SECRET.

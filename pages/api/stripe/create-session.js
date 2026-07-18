import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const CART_STORE = global.__cart_store ||= new Map(); // in-memory for MVP

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { items, successUrl, cancelUrl } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Cart empty' });

  const line_items = items.map(item => ({
    price_data: {
      currency: item.currency || 'USD',
      product_data: { name: item.name },
      unit_amount: Math.round(Number(item.price) * 100)
    },
    quantity: item.quantity || 1
  }));

  const clientReferenceId = uuidv4();
  CART_STORE.set(clientReferenceId, items);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart`,
      client_reference_id: clientReferenceId,
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'FR', 'ES'] }
    });
    res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('stripe create session error', err);
    res.status(500).json({ error: err.message });
  }
}

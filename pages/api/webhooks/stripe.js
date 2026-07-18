import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const CART_STORE = global.__cart_store ||= new Map();

export const config = { api: { bodyParser: false } };

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const rawBody = await buffer(req);
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const clientRef = session.client_reference_id;
    const cart = CART_STORE.get(clientRef);
    try {
      const printfulKey = process.env.PRINTFUL_API_KEY;
      if (!printfulKey) throw new Error('Missing PRINTFUL_API_KEY');

      const recipient = {
        name: session.shipping_details?.name || '',
        address1: session.shipping_details?.address?.line1 || '',
        city: session.shipping_details?.address?.city || '',
        state_code: session.shipping_details?.address?.state || '',
        country_code: session.shipping_details?.address?.country || '',
        zip: session.shipping_details?.address?.postal_code || ''
      };

      const items = (cart || []).map(it => ({
        variant_id: it.variantId,
        quantity: it.quantity
      }));

      const orderBody = { recipient, items };

      const r = await fetch('https://api.printful.com/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${printfulKey}:`).toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderBody)
      });

      const printfulResp = await r.json();
      console.log('Printful order response', printfulResp);
      CART_STORE.delete(clientRef);
    } catch (err) {
      console.error('Error creating Printful order:', err);
    }
  }

  res.json({ received: true });
}

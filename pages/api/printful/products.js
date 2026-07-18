export default async function handler(req, res) {
  const key = process.env.PRINTFUL_API_KEY;
  if (!key) return res.status(500).json({ error: 'Missing PRINTFUL_API_KEY' });

  try {
    const r = await fetch('https://api.printful.com/store/products', {
      headers: { Authorization: `Basic ${Buffer.from(`${key}:`).toString('base64')}` }
    });
    if (!r.ok) return res.status(r.status).json({ error: 'Printful error' });
    const data = await r.json();
    const products = (data.result || []).map(p => ({
      id: p.id,
      name: p.name,
      variants: p.variants.map(v => ({
        id: v.id,
        sku: v.sku,
        retail_price: v.retail_price,
        currency: v.currency
      })),
      files: p.files || []
    }));
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: String(err) });
  }
}

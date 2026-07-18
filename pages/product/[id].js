import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  useEffect(() => {
    if (!id) return;
    fetch('/api/printful/products').then(r => r.json()).then(data => {
      const p = (data.products || []).find(x => String(x.id) === String(id));
      setProduct(p);
    });
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: 20 }}>
      <h1>{product.name}</h1>
      <p>Variants:</p>
      <ul>
        {product.variants.map(v => (
          <li key={v.id}>
            {v.sku} — {v.retail_price} {v.currency}
            <button style={{ marginLeft: 8 }} onClick={() => {
              const cart = JSON.parse(localStorage.getItem('cart') || '[]');
              cart.push({ productId: product.id, variantId: v.id, name: product.name, price: v.retail_price, currency: v.currency, quantity: 1 });
              localStorage.setItem('cart', JSON.stringify(cart));
              alert('Added to cart');
            }}>Add to cart</button>
          </li>
        ))}
      </ul>
      <p><a href="/cart">Go to Cart</a></p>
    </main>
  );
}

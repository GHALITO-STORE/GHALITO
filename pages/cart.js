import { useEffect, useState } from 'react';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  useEffect(() => setCart(JSON.parse(localStorage.getItem('cart') || '[]')), []);
  if (!cart.length) return <div style={{padding:20}}>Your cart is empty</div>;

  async function checkout() {
    const res = await fetch('/api/stripe/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, successUrl: window.location.origin + '/success', cancelUrl: window.location.origin + '/cart' })
    });
    const json = await res.json();
    if (json.url) window.location.href = json.url;
    else alert('Checkout error: ' + (json.error || JSON.stringify(json)));
  }

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: 20 }}>
      <h1>Cart</h1>
      <ul>
        {cart.map((it, i) => <li key={i}>{it.name} — {it.price} {it.currency} × {it.quantity}</li>)}
      </ul>
      <button onClick={checkout}>Checkout</button>
    </main>
  );
}

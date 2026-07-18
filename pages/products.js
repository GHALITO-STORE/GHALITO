import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('/api/printful/products').then(r => r.json()).then(data => setProducts(data.products || []));
  }, []);
  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: 20 }}>
      <h1>Products</h1>
      <ul>
        {products.map(p => (
          <li key={p.id} style={{ marginBottom: 16 }}>
            <h3>{p.name}</h3>
            <Link href={`/product/${p.id}`}>View</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

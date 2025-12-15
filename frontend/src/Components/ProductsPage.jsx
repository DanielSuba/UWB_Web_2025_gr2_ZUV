import { useEffect, useState } from "react";
import { Product } from './Product';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((response) => response.json())
      .then((parsedData) => {
      setProducts(parsedData || []);
      setLoading(false);
      })
      .catch(() => {
      setError('Cannot load products right now.');
      setLoading(false);
      });
  }, []);

  return (
    <section className="panel" id="products">
      <div className="panel-header">
        <p className="eyebrow">Catalog</p>
        <div>
          <h2 className="section-title">Products</h2>
          <p className="section-subtitle">Choose your favorites and add them to the cart.</p>
        </div>
      </div>
      {loading && <div className="muted">Loading products…</div>}
      {error && <div className="error-text">{error}</div>}
      <div className='products-grid'>
        {products?.map((product) => (
          <Product key={product.Id || product.Name} product={product} />
        ))}
      </div>
    </section>
  );
};

export { ProductsPage };
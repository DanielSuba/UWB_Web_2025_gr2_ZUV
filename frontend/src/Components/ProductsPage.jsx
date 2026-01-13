import { useEffect, useState } from "react";
import { Product } from './Product';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Stany dla filtrów
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(''); // 'asc' lub 'desc'

  useEffect(() => {
    setLoading(true);
    // Budowanie URL z parametrami zapytania
    const query = new URLSearchParams({
      name: search,
      price_sort: sort
    }).toString();

    fetch(`http://localhost:5000/products?${query}`)
      .then((response) => response.json())
      .then((parsedData) => {
        setProducts(parsedData || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Cannot load products right now.');
        setLoading(false);
      });
  }, [search, sort]); // Reaguj na zmianę wyszukiwania lub sortowania

  return (
    <section className="panel" id="products">
      <div className="panel-header">
        <p className="eyebrow">Catalog</p>
        <div>
          <h2 className="section-title">Products</h2>
          <p className="section-subtitle">Choose your favorites and add them to the cart.</p>
        </div>
      </div>

      {/* Panel filtrów i sortowania */}
      <div className="action-row" style={{ marginBottom: '24px', gap: '12px' }}>
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ 
            flex: 1, 
            padding: '10px', 
            borderRadius: '10px', 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.14)',
            color: 'white'
          }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`ghost-button ${sort === 'asc' ? 'active' : ''}`} 
            onClick={() => setSort(sort === 'asc' ? '' : 'asc')}
          >
            Price: Low to High
          </button>
          <button 
            className={`ghost-button ${sort === 'desc' ? 'active' : ''}`} 
            onClick={() => setSort(sort === 'desc' ? '' : 'desc')}
          >
            Price: High to Low
          </button>
        </div>
      </div>

      {loading && <div className="muted">Loading products…</div>}
      {error && <div className="error-text">{error}</div>}
      
      <div className='products-grid'>
        {products?.map((product) => (
          <Product key={product.Id || product.Name} product={product} />
        ))}
        {!loading && products.length === 0 && <div className="muted">No products found.</div>}
      </div>
    </section>
  );
};

export { ProductsPage };
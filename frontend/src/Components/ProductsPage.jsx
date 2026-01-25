import { useEffect, useState } from "react";
import { Product } from './Product';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Stan dla filtrów i sortowania
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(''); 

  // Stan dla pagynacji
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    // Budowanie URL z uwzględnieniem pagynacji
    const query = new URLSearchParams({
      name: search,
      price_sort: sort,
      page: page,
      limit: 8 // stały limit na stronę
    }).toString();

    fetch(`http://localhost:5000/products?${query}`)
      .then((response) => response.json())
      .then((res) => {
        // Backend teraz zwraca obiekt { data, total, pages }
        setProducts(res.data || []);
        setTotalPages(res.pages || 1);
        setLoading(false);
      })
      .catch(() => {
        setError('Cannot load products right now.');
        setLoading(false);
      });
  }, [search, sort, page]); // Reaguj na zmianę filtrów lub strony

  // Resetuj stronę do 1, gdy użytkownik zmienia wyszukiwanie lub sortowanie
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortChange = (newSort) => {
    setSort(sort === newSort ? '' : newSort);
    setPage(1);
  };

  return (
    <section className="panel" id="products">
      <div className="panel-header">
        <p className="eyebrow">Catalog</p>
        <div>
          <h2 className="section-title">Products</h2>
          <p className="section-subtitle">Choose your favorites and add them to the cart.</p>
        </div>
      </div>

      <div className="action-row" style={{ marginBottom: '24px', gap: '12px' }}>
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={search}
          onChange={handleSearchChange}
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
            onClick={() => handleSortChange('asc')}
          >
            Price: Low to High
          </button>
          <button 
            className={`ghost-button ${sort === 'desc' ? 'active' : ''}`} 
            onClick={() => handleSortChange('desc')}
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

      {/* Panel Pagynacji */}
      {!loading && totalPages > 1 && (
        <div className="pagination" style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'center', alignItems: 'center' }}>
            <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)} 
                className="ghost-button"
            >
                Previous
            </button>
            <span className="muted">Page {page} of {totalPages}</span>
            <button 
                disabled={page === totalPages} 
                onClick={() => setPage(p => p + 1)} 
                className="ghost-button"
            >
                Next
            </button>
        </div>
      )}
    </section>
  );
};

export { ProductsPage };
import { useEffect, useState } from "react";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Nowe stany dla filtrów i pagynacji
    const [sort, setSort] = useState('desc'); // Najnowsze na górze
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setLoading(true);
        // Budowanie URL z parametrami sortowania i pagynacji
        const query = new URLSearchParams({
            date_sort: sort,
            page: page,
            limit: 5
        }).toString();

        fetch(`http://localhost:5000/orders?${query}`)
          .then((response) => response.json())
          .then((res) => {
            // Backend zwraca teraz obiekt { data, total, pages }
            setOrders(res.data || []);
            setTotalPages(res.pages || 1);
            setLoading(false);
          })
          .catch(() => {
            setError('Cannot load orders right now.');
            setLoading(false);
          });
    }, [sort, page]); // Reaguj na zmianę sortowania lub strony

    const handleSortChange = (newSort) => {
        setSort(newSort);
        setPage(1); // Resetuj do pierwszej strony przy zmianie sortowania
    };

    return (
        <section className="panel" id="orders">
            <div className="panel-header">
                <p className="eyebrow">History</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                        <h2 className="section-title">Orders</h2>
                        <p className="section-subtitle">Track what has already been placed.</p>
                    </div>

                    {/* Przełącznik sortowania dający te same opcje co w produktach */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            className={`ghost-button ${sort === 'asc' ? 'active' : ''}`} 
                            onClick={() => handleSortChange('asc')}
                        >
                            Oldest
                        </button>
                        <button 
                            className={`ghost-button ${sort === 'desc' ? 'active' : ''}`} 
                            onClick={() => handleSortChange('desc')}
                        >
                            Newest
                        </button>
                    </div>
                </div>
            </div>

            {loading && <div className="muted">Loading orders…</div>}
            {error && <div className="error-text">{error}</div>}

            <div className='orders-grid'>
                {orders?.map((order) => (
                    <article className="card order-card" key={order.id}>
                        <header className="order-header">
                            <div className="meta-line">
                                <span className="meta-label">Order</span>
                                <span className="meta-value" style={{ fontSize: '0.7rem' }}>#{order.id}</span>
                            </div>
                            <div className="meta-line">
                                <span className="meta-label">Date</span>
                                <span className="meta-value">
                                    {new Date(order.date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="meta-line">
                                <span className="meta-label">Total</span>
                                <span className="meta-value">{order.totalSum} zł</span>
                            </div>
                        </header>
                        <div className="order-products">
                            {order.products?.map((product, idx) => (
                                <div className="order-product" key={`${order.id}-${idx}`}>
                                    <div className="mini-media" aria-hidden>
                                        <div
                                            className="media-placeholder"
                                            dangerouslySetInnerHTML={{ __html: product.Image }}
                                        />
                                    </div>
                                    <div className="order-product-info" style={{ flex: 1 }}>
                                        <div className="meta-line">
                                            <span className="meta-label">Name</span>
                                            <span className="meta-value">{product.Name}</span>
                                        </div>
                                        <div className="meta-line">
                                            <span className="meta-label">Price</span>
                                            <span className="meta-value">{product.Price} zł</span>
                                        </div>
                                        <div className="meta-line">
                                            <span className="meta-label">Qty</span>
                                            <span className="meta-value">{product.Qty}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </article>
                ))}
                {!loading && !orders.length && <div className="muted">No orders yet.</div>}
            </div>

            {/* Kontrolki pagynacji */}
            {!loading && totalPages > 1 && (
                <div className="pagination-row" style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center' }}>
                    <button 
                        disabled={page === 1} 
                        className="ghost-button" 
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </button>
                    <span className="muted">Page {page} of {totalPages}</span>
                    <button 
                        disabled={page === totalPages} 
                        className="ghost-button" 
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
};

export { OrdersPage };
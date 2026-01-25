import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sort, setSort] = useState('desc');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const query = new URLSearchParams({
            date_sort: sort,
            page: page,
            limit: 5
        }).toString();

        fetch(`http://localhost:5000/orders?${query}`)
            .then((response) => response.json())
            .then((res) => {
                const orderData = Array.isArray(res) ? res : (res.data || []);
                setOrders(orderData);
                setTotalPages(res.pages || 1);
                setLoading(false);
            })
            .catch(() => {
                setError('Cannot load orders right now.');
                setLoading(false);
            });
    }, [sort, page]);

    const handleSortChange = (newSort) => {
        setSort(newSort);
        setPage(1);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.trim() === '') {
            setSearchResults([]);
            setIsSearching(false);
            setPage(1);
            return;
        }
        
        setIsSearching(true);
        // Fetch all orders without pagination to search across all pages
        fetch(`http://localhost:5000/orders?limit=1000&date_sort=${sort}`)
            .then((response) => response.json())
            .then((res) => {
                const allOrders = Array.isArray(res) ? res : (res.data || []);
                const queryLower = query.toLowerCase();
                
                const filtered = allOrders.filter(order => {
                    // Search by product name
                    const matchesProductName = order.products?.some(product => 
                        product.Name.toLowerCase().includes(queryLower)
                    );
                    
                    // Search by date
                    const orderDate = new Date(order.date).toLocaleDateString().toLowerCase();
                    const matchesDate = orderDate.includes(queryLower);
                    
                    return matchesProductName || matchesDate;
                });
                
                setSearchResults(filtered);
            })
            .catch(() => {
                setError('Cannot search orders right now.');
            });
    };

    const displayOrders = isSearching ? searchResults : orders;

    return (
        <section className="panel" id="orders">
            <div className="panel-header">
                <p className="eyebrow">History</p>
                <div>
                    <h2 className="section-title">Orders</h2>
                    <p className="section-subtitle">Track what has already been placed.</p>
                </div>
            </div>
            {loading && <div className="muted">Loading orders…</div>}
            {error && <div className="error-text">{error}</div>}
            
            {/* Top Bar: Search and Sort */}
            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                {/* Search Input */}
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <input
                        type="text"
                        placeholder="Search by product name or date (all pages)..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid var(--color-border, #e0e0e0)',
                            borderRadius: '6px',
                            fontSize: '0.95rem',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>

                {/* Sort Controls */}
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

            <div className='orders-grid'>
                {displayOrders.length > 0 ? (
                    displayOrders.map((order) => (
                        <article className="card order-card" key={order.id}>
                            <header className="order-header">
                                <div className="meta-line">
                                    <span className="meta-label">Order</span>
                                    <span className="meta-value">#{order.id}</span>
                                </div>
                                <div className="meta-line">
                                    <span className="meta-label">Date</span>
                                    <span className="meta-value">{new Date(order.date).toLocaleDateString()}</span>
                                </div>
                                <div className="meta-line">
                                    <span className="meta-label">Total</span>
                                    <span className="meta-value">{order.totalSum} zł</span>
                                </div>
                            </header>
                            <div className="order-products">
                                {order.products?.map((product) => (
                                    <div className="order-product" key={`${order.id}-${product.Name}`}>
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
                                        <div className="mini-media" aria-hidden>
                                            <div
                                                className="media-placeholder"
                                                dangerouslySetInnerHTML={{ __html: product.Image }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                className="primary-button" 
                                onClick={() => navigate(`/order/${order.id}`, { state: { order } })}
                                style={{ marginTop: '16px', width: '100%' }}
                            >
                                Open Details
                            </button>
                        </article>
                    ))
                ) : (
                    !loading && <div className="muted">No orders found.</div>
                )}
            </div>

            {/* Pagination - only show if not searching */}
            {!loading && !isSearching && totalPages > 1 && (
                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center' }}>
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

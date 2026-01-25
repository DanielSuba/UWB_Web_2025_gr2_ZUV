import { useEffect, useState } from "react";

const OrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchId, setSearchId] = useState('');
    const [sort, setSort] = useState('desc');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setLoading(true);
        const query = new URLSearchParams({
            date_sort: sort,
            page: page,
            limit: 10
        }).toString();

        fetch(`http://localhost:5000/orders?${query}`)
            .then((response) => response.json())
            .then((res) => {
                let filteredOrders = res.data || [];
                
                // Client-side search by order ID
                if (searchId.trim()) {
                    filteredOrders = filteredOrders.filter(order => 
                        order.id.toLowerCase().includes(searchId.toLowerCase())
                    );
                }
                
                setOrders(filteredOrders);
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
        setSearchId(e.target.value);
        setPage(1);
    };

    const filteredOrders = orders.filter(order =>
        searchId.trim() === '' || order.id.toLowerCase().includes(searchId.toLowerCase())
    );

    return (
        <section className="panel" id="order-list">
            <div className="panel-header">
                <p className="eyebrow">Overview</p>
                <h2 className="section-title">Orders List</h2>
                <p className="section-subtitle">View all your orders in one place.</p>
            </div>

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
                        placeholder="Search by Order ID..."
                        value={searchId}
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
                        Oldest First
                    </button>
                    <button
                        className={`ghost-button ${sort === 'desc' ? 'active' : ''}`}
                        onClick={() => handleSortChange('desc')}
                    >
                        Newest First
                    </button>
                </div>
            </div>

            {/* Loading and Error States */}
            {loading && <div className="muted">Loading orders…</div>}
            {error && <div className="error-text">{error}</div>}

            {/* Orders Table */}
            {!loading && !error && (
                <>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '0.95rem'
                        }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border, #e0e0e0)' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Order ID</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Sum Price</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            style={{
                                                borderBottom: '1px solid var(--color-border, #e0e0e0)',
                                                backgroundColor: 'var(--color-bg-secondary, #fafafa)',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-hover, #f0f0f0)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary, #fafafa)'}
                                        >
                                            <td style={{ padding: '12px' }}>
                                                <span style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                                                    #{order.id.slice(0, 8)}...
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', fontWeight: '600' }}>
                                                {order.totalSum} zł
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                {new Date(order.date).toLocaleDateString('pl-PL', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted, #666)' }}>
                                            No orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div style={{
                            marginTop: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '15px',
                            alignItems: 'center'
                        }}>
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
                </>
            )}
        </section>
    );
};

export { OrderListPage };

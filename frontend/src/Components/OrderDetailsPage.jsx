import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const OrderDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const orderId = location.pathname.split('/').pop();
        
        if (location.state?.order) {
            setOrder(location.state.order);
            setLoading(false);
        } else {
            fetch(`http://localhost:5000/orders?limit=1000`)
                .then((response) => response.json())
                .then((res) => {
                    const allOrders = Array.isArray(res) ? res : (res.data || []);
                    const foundOrder = allOrders.find(o => o.id === orderId);
                    if (foundOrder) {
                        setOrder(foundOrder);
                    } else {
                        setError('Order not found.');
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setError('Cannot load order details.');
                    setLoading(false);
                });
        }
    }, [location]);

    if (loading) return <div className="muted">Loading order details…</div>;
    if (error) return <div className="error-text">{error}</div>;
    if (!order) return <div className="muted">Order not found.</div>;

    const orderDate = new Date(order.date);
    const totalProductCount = order.products?.reduce((sum, p) => sum + p.Qty, 0) || 0;
    const totalProductTypes = order.products?.length || 0;

    return (
        <section className="panel" id="order-details">
            <div className="panel-header">
                <button 
                    className="ghost-button" 
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    ← Back to Orders
                </button>
                <p className="eyebrow">Order Details</p>
                <h2 className="section-title">Order #{order.id.slice(0, 12)}...</h2>
                <p className="section-subtitle">Complete order information and purchase details</p>
            </div>

            {/* Order Header - Key Information */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '40px',
                padding: '24px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
                <div>
                    <span className="meta-label" style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order ID</span>
                    <span className="meta-value" style={{ fontSize: '1.1rem', fontFamily: 'monospace', color: '#f4f4f4' }}>{order.id}</span>
                </div>
                <div>
                    <span className="meta-label" style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Date & Time</span>
                    <span className="meta-value" style={{ fontSize: '1rem', color: '#f4f4f4' }}>
                        {orderDate.toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.9rem', color: '#a0a0a0' }}>
                        {orderDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <div>
                    <span className="meta-label" style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Amount</span>
                    <span className="meta-value" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#2ecc71' }}>
                        {order.totalSum} zł
                    </span>
                </div>
                <div>
                    <span className="meta-label" style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product Types</span>
                    <span className="meta-value" style={{ fontSize: '1.1rem', color: '#f4f4f4' }}>{totalProductTypes} type(s)</span>
                </div>
                <div>
                    <span className="meta-label" style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Items</span>
                    <span className="meta-value" style={{ fontSize: '1.1rem', color: '#f4f4f4' }}>{totalProductCount} item(s)</span>
                </div>
            </div>

            {/* Products Section */}
            <div style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: '600', color: '#f4f4f4' }}>Products Purchased</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.95rem'
                    }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#f4f4f4' }}>Image</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#f4f4f4' }}>Product Name</th>
                                <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#f4f4f4' }}>Unit Price</th>
                                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#f4f4f4' }}>Quantity</th>
                                <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#f4f4f4' }}>Line Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.products?.map((product, idx) => (
                                <tr
                                    key={`${order.id}-${idx}`}
                                    style={{
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                                        transition: 'background-color 0.2s',
                                        cursor: 'pointer',
                                        backgroundColor: 'rgba(0, 0, 0, 0.15)'
                                    }}
                                    onClick={() => navigate(`/product/${product.Id}`, { state: { product, fromOrderId: order.id } })}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.35)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.15)'}
                                >
                                    <td style={{ padding: '16px' }}>
                                        <div
                                            className="media-placeholder"
                                            style={{ width: '80px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                                            dangerouslySetInnerHTML={{ __html: product.Image }}
                                        />
                                    </td>
                                    <td style={{ padding: '16px', color: '#f4f4f4' }}>
                                        <span style={{ fontWeight: '500' }}>{product.Name}</span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right', color: '#c9c9c9' }}>
                                        {product.Price} zł
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#f4f4f4' }}>
                                        {product.Qty}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#2ecc71' }}>
                                        {(product.Price * product.Qty).toFixed(2)} zł
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Summary */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '24px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '24px'
            }}>
                <div style={{ textAlign: 'right', minWidth: '300px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#c9c9c9' }}>
                        <span className="meta-label">Subtotal</span>
                        <span>{order.totalSum} zł</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#c9c9c9' }}>
                        <span className="meta-label">Shipping</span>
                        <span>Free</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '2px solid rgba(255, 255, 255, 0.08)' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f4f4f4' }}>Order Total</span>
                        <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#2ecc71' }}>
                            {order.totalSum} zł
                        </span>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                    className="primary-button" 
                    onClick={() => navigate(-1)}
                    style={{ padding: '12px 32px' }}
                >
                    ← Back to Orders
                </button>
            </div>
        </section>
    );
};

export { OrderDetailsPage };

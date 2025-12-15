import { useEffect, useState } from "react";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch("http://localhost:5000/orders")
          .then((response) => response.json())
          .then((parsedData) => {
            setOrders(parsedData || []);
            setLoading(false);
          })
          .catch(() => {
            setError('Cannot load orders right now.');
            setLoading(false);
          });
    }, []);

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
            <div className='orders-grid'>
                {orders?.map((order) => (
                    <article className="card order-card" key={order.id}>
                        <header className="order-header">
                            <div className="meta-line">
                                <span className="meta-label">Order</span>
                                <span className="meta-value">#{order.id}</span>
                            </div>
                            <div className="meta-line">
                                <span className="meta-label">Date</span>
                                <span className="meta-value">{order.date}</span>
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
                    </article>
                ))}
                {!loading && !orders.length && <div className="muted">No orders yet.</div>}
            </div>
        </section>
    );
};

export { OrdersPage };
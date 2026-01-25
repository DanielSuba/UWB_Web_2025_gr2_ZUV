import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ProductDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const fromOrderId = location.state?.fromOrderId;

    useEffect(() => {
        const productId = location.pathname.split('/').pop();
        
        if (location.state?.product) {
            setProduct(location.state.product);
            setLoading(false);
        } else {
            fetch(`http://localhost:5000/products/${productId}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        setError('Product not found.');
                    } else {
                        setProduct(data);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setError('Cannot load product details.');
                    setLoading(false);
                });
        }
    }, [location]);

    if (loading) return <div className="muted">Loading product details…</div>;
    if (error) return <div className="error-text">{error}</div>;
    if (!product) return <div className="muted">Product not found.</div>;

    const handleBack = () => {
        if (fromOrderId) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <section className="panel" id="product-details">
            <div className="panel-header">
                <button 
                    className="ghost-button" 
                    onClick={handleBack}
                    style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    ← Back {fromOrderId ? 'to Order' : 'to Products'}
                </button>
                <p className="eyebrow">Product Details</p>
                <h2 className="section-title">{product.Name}</h2>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '40px',
                marginBottom: '40px'
            }}>
                {/* Product Image */}
                <div>
                    <div
                        className="media-placeholder"
                        style={{
                            width: '100%',
                            height: '400px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                        dangerouslySetInnerHTML={{ __html: product.Image }}
                    />
                </div>

                {/* Product Information */}
                <div>
                    <div style={{ marginBottom: '24px' }}>
                        <span className="meta-label" style={{ display: 'block', marginBottom: '8px' }}>Product ID</span>
                        <span style={{ fontSize: '0.95rem', fontFamily: 'monospace', color: '#a0a0a0' }}>
                            {product.Id}
                        </span>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <span className="meta-label" style={{ display: 'block', marginBottom: '8px' }}>Product Name</span>
                        <span style={{ fontSize: '1.3rem', fontWeight: '600', color: '#f4f4f4' }}>
                            {product.Name}
                        </span>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <span className="meta-label" style={{ display: 'block', marginBottom: '8px' }}>Description</span>
                        <span style={{ fontSize: '1rem', lineHeight: '1.6', color: '#c9c9c9' }}>
                            {product.Description || 'No description available.'}
                        </span>
                    </div>

                    <div style={{
                        padding: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                        <div style={{ marginBottom: '16px' }}>
                            <span className="meta-label" style={{ display: 'block', marginBottom: '8px' }}>Price</span>
                            <span style={{ fontSize: '2rem', fontWeight: '700', color: '#2ecc71' }}>
                                {product.Price} zł
                            </span>
                        </div>

                        <div>
                            <span className="meta-label" style={{ display: 'block', marginBottom: '8px' }}>Available Stock</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f4f4f4' }}>
                                {product.Qty || 'N/A'} units
                            </span>
                        </div>
                    </div>

                    {product.Category && (
                        <div style={{ marginBottom: '24px' }}>
                            <span className="meta-label" style={{ display: 'block', marginBottom: '8px' }}>Category</span>
                            <span style={{ fontSize: '1rem', color: '#f4f4f4' }}>
                                {product.Category}
                            </span>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                        <button 
                            className="primary-button"
                            onClick={handleBack}
                            style={{ padding: '12px 32px', flex: 1 }}
                        >
                            ← Back {fromOrderId ? 'to Order' : 'to Products'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { ProductDetailsPage };

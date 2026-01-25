import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data));
    }, [id]);

    if (!product) return <div className="muted">Loading...</div>;

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart-products") ?? '[]');
        cart.push({ ...product, Qty: 1 });
        localStorage.setItem("cart-products", JSON.stringify(cart));
        navigate('/cart');
    };

    return (
        <section className="panel product-details">
            <div className="details-grid">
                <div className="media-placeholder" dangerouslySetInnerHTML={{ __html: product.Image }} />
                <div className="details-content">
                    <h2 className="section-title">{product.Name}</h2>
                    <p className="description">{product.Description}</p>
                    <div className="meta-line">
                        <span className="meta-label">Price</span>
                        <span className="meta-value">{product.Price} zł</span>
                    </div>
                    <div className="meta-line">
                        <span className="meta-label">In Stock</span>
                        <span className="meta-value">{product.Qty}</span>
                    </div>
                    <button className="primary-button" onClick={addToCart} disabled={product.Qty <= 0}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </section>
    );
};
import { useEffect, useState, useCallback } from "react";

const CartPage = () => {
    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const cartProducts = localStorage.getItem("cart-products") ?? '[]';
        const cartProductsParsed = JSON.parse(cartProducts);

        setProducts(cartProductsParsed);
    }, [reload]);

    const removeProductFromCart = (product) => {
        const cartProducts = localStorage.getItem("cart-products") ?? '[]';
        const cartProductsParsed = JSON.parse(cartProducts);
        const removeIndex = cartProductsParsed.findIndex((prod) => prod.Id === product.Id);
        if (removeIndex >= 0) {
            cartProductsParsed.splice(removeIndex, 1);
            localStorage.setItem("cart-products", JSON.stringify(cartProductsParsed));
            setReload(!reload);
        }
    };

    const confirmOrder = useCallback(() => {
        if (!products.length) return;

        fetch("http://localhost:5000/orders", {
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(products)
        })
          .then(() => {
            localStorage.setItem("cart-products", "[]");
            window.location.reload();
          })
    }, [products]);

    const cartTotal = products.reduce((sum, item) => {
        const price = Number(item?.Price) || 0;
        const qty = Number(item?.Qty) || 0;
        return sum + price * qty;
    }, 0);
    
    return (
        <section className="panel" id="cart">
            <div className="panel-header">
                <p className="eyebrow">Bag</p>
                <div>
                    <h2 className="section-title">Cart</h2>
                    <p className="section-subtitle">Adjust your picks before placing the order.</p>
                </div>
            </div>
            <div className='products-grid'>
                {products?.map((product) => (
                    <article className="card" key={`${product.Id}-${product.Name}`}>
                        <div className="card-body">
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
                        <div className="card-footer">
                            <button className="ghost-button" onClick={() => removeProductFromCart(product)}>Remove</button>
                        </div>
                    </article>
                ))}
                {!products.length && <div className="muted">Cart is empty.</div>}
            </div>
            <div className="panel-actions">
                <div className="cart-total">
                    <span className="meta-label">Total</span>
                    <span className="meta-value">{cartTotal.toFixed(2)} zł</span>
                </div>
                <button className="primary-button" onClick={() => confirmOrder()} disabled={!products.length}>
                    Confirm Order
                </button>
            </div>
        </section>
    );
};

export { CartPage };

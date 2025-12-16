import { useState } from "react";

const Product = ({ product }) => {
    const [addQty, setAddQty] = useState(1);

    const changeAddQty = (e) => {
        const value = Number(e.target.value);
        setAddQty(Number.isNaN(value) ? 1 : value);
    };

    const saveProductInCart = (value) => {
        if (addQty > 0) {
            const cartProducts = localStorage.getItem("cart-products") ?? '[]';
            const cartProductsParsed = JSON.parse(cartProducts);
            cartProductsParsed.push({
                ...value,
                Qty: addQty
            });
            localStorage.setItem("cart-products", JSON.stringify(cartProductsParsed));
            window.location.reload();
        }
    };

    return (
        <article className="card product-card">
            <div className="card-media" aria-hidden>
                <div 
                    className="media-placeholder"
                    dangerouslySetInnerHTML={{ __html: product.Image }}
                />
            </div>
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
                    <span className="meta-label">Stock</span>
                    <span className="meta-value">{product.Qty}</span>
                </div>
                <div className="action-row">
                    <label className="input-stack">
                        {/* <span className="meta-label">Qty</span> */}
                        <input onChange={changeAddQty} value={addQty} type='number' min={1} />
                    </label>
                    {/* <button className="ghost-button" onClick={() => saveProductInCart(product)}>
                        Add To Cart
                    </button> */}
                </div>
            </div>
        </article>
    );
};

export { Product };

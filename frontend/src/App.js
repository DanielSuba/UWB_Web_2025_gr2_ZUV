import './App.css';
import { ProductsPage } from './Components/ProductsPage';
import { CartPage } from './Components/Cart';
import { OrdersPage } from './Components/Order';

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">Monochrome Market</div>
        <nav className="nav-links">
          <a href="#products">Products</a>
          <a href="#cart">Cart</a>
          <a href="#orders">Orders</a>
        </nav>
      </header>

      <main className="page">
        <section className="hero">
          <div>
            <p className="eyebrow">Minimal Shop</p>
            <h1>Black & White, Bold & Clean.</h1>
            <p className="lead">Browse products, craft your cart, and review previous orders in one calm canvas.</p>
          </div>
          <div className="hero-badge">
            <span className="badge-label">Live backend</span>
            <span className="badge-value">localhost:5000</span>
          </div>
        </section>

        <ProductsPage />
        <CartPage />
        <OrdersPage />
      </main>
    </div>
  );
}

export default App;

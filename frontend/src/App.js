import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductsPage } from './Components/ProductsPage';
import { CartPage } from './Components/Cart';
import { OrdersPage } from './Components/Order';
import { Navbar } from './Components/Navbar';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Navbar />

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

          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

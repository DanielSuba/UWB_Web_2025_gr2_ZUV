import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductsPage } from './Components/ProductsPage';
import { CartPage } from './Components/Cart';
import { OrdersPage } from './Components/Order';
import { OrderDetailsPage } from './Components/OrderDetailsPage';
import { ProductDetailsPage } from './Components/ProductDetailsPage';
import { Navbar } from './Components/Navbar';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Navbar />

        <main className="page">
          <section className="hero">
            <div>
              <p className="eyebrow">Poligazyn</p>
              <h1>Buy premium shapes from the 2D world.</h1>
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
            <Route path="/order/:id" element={<OrderDetailsPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

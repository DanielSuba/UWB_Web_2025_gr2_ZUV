import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <header className="topbar">
            <Link to="/" className="brand">Monochrome Market</Link>
            <nav className="nav-links">
                <Link to="/">Products</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/orders">Orders</Link>
            </nav>
        </header>
    );
};

export { Navbar };

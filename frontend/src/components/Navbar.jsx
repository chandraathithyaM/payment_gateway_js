import { Link } from 'react-router-dom';

/**
 * Navbar — sticky top navigation with brand logo and secure badge.
 */
function Navbar() {
  return (
    <nav className="navbar" id="main-navbar">
      <Link to="/" className="navbar-brand">
        <div className="logo-icon">💳</div>
        <span className="gradient-text">PayFlow</span>
      </Link>
      <div className="navbar-badge">🔒 Secure Checkout</div>
    </nav>
  );
}

export default Navbar;

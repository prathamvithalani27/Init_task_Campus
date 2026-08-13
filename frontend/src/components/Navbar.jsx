import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">CampusEvent</Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Events</Link>
        <Link to="/admin" className="nav-link">Admin</Link>
      </div>
    </nav>
  );
}

export default Navbar;

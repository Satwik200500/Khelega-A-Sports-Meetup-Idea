import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src="/logo-turf.png" alt="Khelega" className="navbar-logo-img" />
        
      </Link>

      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/create-post">Create Post</Link>

            <div className="user-menu" ref={menuRef}>
              <button
                className={`user-avatar-btn ${menuOpen ? "user-avatar-btn-active" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="user-avatar-circle">{user.name.charAt(0).toUpperCase()}</span>
                <svg
                  className={`user-chevron ${menuOpen ? "user-chevron-open" : ""}`}
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {menuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <span className="user-avatar-circle user-avatar-circle-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="user-dropdown-name">{user.name}</p>
                      <p className="user-dropdown-email">{user.email}</p>
                    </div>
                  </div>

                  <div className="user-dropdown-divider"></div>

                  <Link to="/my-posts" className="user-dropdown-item" onClick={() => setMenuOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M3 9h18" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    My Posts
                  </Link>

                  <Link to="/terms" className="user-dropdown-item" onClick={() => setMenuOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12h6M9 16h6M9 8h6M6 4h9l3 3v13a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Terms & Conditions
                  </Link>

                  <div className="user-dropdown-divider"></div>

                  <button className="user-dropdown-item user-dropdown-danger" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="btn-primary-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
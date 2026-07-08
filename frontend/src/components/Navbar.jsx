import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo"> <img src="/logo-turf.png" alt="Khelega" className="navbar-logo-img" /></Link>

      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/create-post">Create Post</Link>
            <Link to="/my-posts">My Posts</Link>
            <span className="navbar-user">Hey, {user.name}</span>
            <button className="btn-outline" onClick={handleLogout}>Logout</button>
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
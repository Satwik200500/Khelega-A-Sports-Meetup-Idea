import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Khelega</p>
      <Link to="/terms">Terms & Conditions</Link>
    </footer>
  );
}

export default Footer;
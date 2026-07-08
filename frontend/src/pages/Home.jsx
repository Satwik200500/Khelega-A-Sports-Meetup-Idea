import { Link } from "react-router-dom";
import HeroIllustration from "../components/HeroIllustration";

function Home() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="home-page">
      <div className="home-hero">
        <HeroIllustration />
        <span className="home-eyebrow">Pickup sports, sorted</span>
        <h1>Short on players? <br />Not anymore.</h1>
        <p className="home-subtitle">
          Post a game, find people nearby, and fill your team in minutes.
          No booking, no bookkeeping — just play.
        </p>

        <div className="home-actions">
          <Link to="/feed" className="btn-primary-link">Browse Games</Link>
          {!isLoggedIn && (
            <Link to="/signup" className="btn-outline-link">Get Started</Link>
          )}
        </div>
      </div>

      <div className="home-steps">
        <div className="home-step">
          <span className="home-step-number">01</span>
          <h3>Post what you need</h3>
          <p>Sport, location, time, and how many players you're missing.</p>
        </div>
        <div className="home-step">
          <span className="home-step-number">02</span>
          <h3>Players find you</h3>
          <p>Nearby players browse open games and join the ones that fit.</p>
        </div>
        <div className="home-step">
          <span className="home-step-number">03</span>
          <h3>Show up and play</h3>
          <p>That's it. No turf booking, no payments — just people showing up.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
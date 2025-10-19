import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

export default function Landing() {
  const nav = useNavigate();

  return (
    <div className="landing">
      <nav className="navbar">
        <div className="logo">Flowee ᨒ</div>
        <div className="nav-links">
          <button onClick={() => nav("/login")} className="btn-text">
            Login
          </button>
          <button onClick={() => nav("/register")} className="btn-primary">
            Get Started
          </button>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-text">
          <h1>
            Your <span>money flow</span>, redefined.
          </h1>
          <p>
            Flowee helps you manage, plan, and grow your finances intelligently.
            Clean design, powerful insights, and AI that works for you.
          </p>

          <button onClick={() => nav("/register")} className="btn-glass big">
            Start for Free
          </button>
        </div>

        <div className="hero-visual">
          <div className="card-balance glass">
            <h3>Current Balance</h3>
            <p>€4,872.23</p>
          </div>
          <div className="card-forecast glass">
            <h3>AI Forecast</h3>
            <p>Next Month +€642</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Flowee — Smart finance, simple design.</p>
      </footer>
    </div>
  );
}

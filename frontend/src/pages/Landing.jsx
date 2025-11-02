import { Link } from "react-router-dom";
import "../styles/Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <h1 className="logo">ᨒ Flowee</h1>
        <nav>
          <Link to="/login" className="nav-btn">
            Login
          </Link>
          <Link to="/register" className="nav-btn-register outlined">
            Register
          </Link>
        </nav>
      </header>

      <main className="landing-main">
        <section className="intro">
          <h2 className="headline">A simple way to manage your money</h2>
          <p className="subtext">
            Flowee helps you keep track of your income and expenses with
            clarity, calmness and ease, built for everyone, especially those who
            want simplicity.
          </p>
          <Link to="/register" className="cta-btn">
            Start for free
          </Link>
        </section>

        <section className="mockup">
          <div className="mockup-card">
            <div className="mockup-header">
              <p className="mockup-balance-label">Current Balance</p>
              <h3 className="mockup-balance">€2,450.00</h3>
            </div>

            <div className="mockup-bars">
              <div className="bar bar-income">
                <span className="span-bar-title">Income €1,800</span>
              </div>
              <div className="bar bar-expense">
                <span className="span-bar-title">Expenses €950</span>
              </div>
            </div>

            <div className="mockup-list">
              <div className="transaction">
                <span>🛒 Groceries</span>
                <p>-€75</p>
              </div>
              <div className="transaction">
                <span>💰 Salary</span>
                <p>+€1,200</p>
              </div>
              <div className="transaction">
                <span>🚗 Fuel</span>
                <p>-€40</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Powered by Artur Wagner</p>
      </footer>
    </div>
  );
}

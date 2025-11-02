import { Link } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  return (
    <div className="login-page">
      <header className="login-header">
        <h1 className="logo">ᨒ Flowee</h1>
      </header>

      <main className="login-container">
        <form className="login-form">
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Log in to continue your journey</p>

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />

          <button type="submit" className="btn-login">
            Login
          </button>

          <p className="login-register">
            Don’t have an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </main>
    </div>
  );
}

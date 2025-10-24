import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const nav = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/login", formData);
      const { user, token } = res.data;
      login(user, token);
      toast.success("Login successful!");
      nav("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials");
    }
  }

  return (
    <div className="auth-page">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="auth-card glass">
        <h2>Welcome to Flowee</h2>
        <p className="subtitle">Log in to continue managing your flow.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary full">
            Login
          </button>
        </form>

        <p className="redirect">
          Don’t have an account?{" "}
          <span onClick={() => nav("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}

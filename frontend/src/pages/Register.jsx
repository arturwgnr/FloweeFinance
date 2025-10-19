import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "../styles/register.css";
import { useNavigate } from "react-router";

export default function Register() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const nav = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.repeatPassword) {
      alert("❌ Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/register", formData);
      const userData = res.data.newProfile;
      login(userData, null);
      alert("✅ Registration successful!");

      nav("/login");
    } catch (error) {
      console.error(error);
      alert("❌ Error during registration");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <h2>Create Account 🚀</h2>
        <p className="subtitle">
          Join Flowee and take control of your finances.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
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
          <input
            type="password"
            name="repeatPassword"
            placeholder="Repeat Password"
            value={formData.repeatPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-primary full">
            Register
          </button>
        </form>

        <p className="redirect">
          Already have an account?{" "}
          <span onClick={() => (window.location.href = "/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

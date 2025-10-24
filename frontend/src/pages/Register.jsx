import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "../styles/register.css";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";

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

  function validateForm() {
    const { username, email, password, repeatPassword } = formData;

    // Username
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return false;
    }
    if (username.length > 15) {
      toast.error("Username cannot exceed 15 characters");
      return false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Password
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    // Repeat Password
    if (password !== repeatPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await api.post("/register", formData);
      const userData = res.data.newProfile;
      login(userData, null);
      toast.success("Registration successful!");
      nav("/login");
    } catch (error) {
      console.error(error);
      toast.error("Error during registration");
    }
  }

  return (
    <div className="auth-page">
      <Toaster position="top-center" reverseOrder={false} />
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

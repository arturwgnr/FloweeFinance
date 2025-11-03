import { Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.email === "" || formData.password === "") {
      return toast.warning("Please check information!");
    }

    try {
      const res = await loginUser(formData);
      console.log(res.data);

      toast.success("Login successfull!");
      nav("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Error during to login!");
    }
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <h1 onClick={() => nav("/")} className="logo">
          ᨒ Flowee
        </h1>
      </header>

      <main className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="title">
            <h2 className="login-title">Welcome back</h2>
            <p className="login-subtitle">Log in to continue your journey</p>
          </div>

          <label>Email</label>
          <input
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            type="email"
            name="email"
            placeholder="example@email.com"
            required
          />

          <label>Password</label>
          <input
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
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

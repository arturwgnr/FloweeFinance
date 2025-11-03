import { Link } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [repeatedPassword, setRepeatedPassword] = useState("");

  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== repeatedPassword) {
      return toast.warning("Passwords must match!");
    }

    if (formData.password.length <= 5) {
      return toast.warning("Password is too short.");
    }
    try {
      const res = await registerUser(formData);
      console.log(res.data);

      toast.success("User created successfully!");

      nav("/login");
    } catch (error) {
      console.error(error);
      return toast.error("Error creating user!");
    }
  }

  return (
    <div className="register-page">
      <header className="register-header">
        <h1 onClick={() => nav("/")} className="logo">
          ᨒ Flowee
        </h1>
      </header>

      <main className="register-container">
        <form onSubmit={handleSubmit} className="register-form">
          <div className="title">
            <h2 className="register-title">Create your account</h2>
            <p className="register-subtitle">
              Join Flowee and start organizing your finances today.
            </p>
          </div>

          <label>Name</label>
          <input
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            type="text"
            name="name"
            placeholder="Katia Lucia"
            required
          />

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

          <label>Repeat Password</label>
          <input
            value={repeatedPassword}
            onChange={(e) => setRepeatedPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            required
          />

          <button type="submit" className="btn-register">
            Register
          </button>

          <p className="register-login">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </main>
    </div>
  );
}

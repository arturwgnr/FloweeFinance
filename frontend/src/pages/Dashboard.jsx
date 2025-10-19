import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);

  const nav = useNavigate();

  async function fetchTransactions() {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data.transaction || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="dashboard">
      {/* Top Bar */}
      <nav className="topbar glass">
        <h2 className="logo">Flowee ᨒ</h2>
        <div className="user-area">
          <span className="username">{user ? user.username : "User"}</span>
          <button
            onClick={() => {
              logout();
              nav("/");
            }}
            className="btn-logout"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="main-content">
        <h3 className="welcome">
          Welcome back, {user ? user.username : "User"} 👋
        </h3>

        {/* Summary Cards */}
        <section className="summary">
          <div className="summary-card glass">
            <h4>Total Balance</h4>
            <p>€4,872.23</p>
          </div>
          <div className="summary-card glass">
            <h4>Income</h4>
            <p className="green">+€1,420</p>
          </div>
          <div className="summary-card glass">
            <h4>Expenses</h4>
            <p className="red">-€780</p>
          </div>
        </section>

        {/* Transactions */}
        <section className="transactions glass">
          <h4>Your Transactions</h4>
          {transactions.length === 0 ? (
            <p className="no-transactions">No transactions yet.</p>
          ) : (
            <ul>
              {transactions.map((t) => (
                <li key={t.id}>
                  <div className="t-title">{t.title}</div>
                  <div className={`t-amount ${t.type}`}>
                    {t.type === "income" ? "+" : "-"}€{t.amount}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

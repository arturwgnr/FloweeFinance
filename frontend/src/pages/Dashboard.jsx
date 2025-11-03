import { useState, useEffect } from "react";
import { getTransactions } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  const nav = useNavigate();

  const incomeTotal = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0)
    .toFixed(2);

  const expenseTotal = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0)
    .toFixed(2);

  const balance = (parseFloat(incomeTotal) - parseFloat(expenseTotal)).toFixed(
    2
  );

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    async function fetchData() {
      try {
        const res = await getTransactions(userId);

        setTransactions(res.data.transactions);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      {/* ===== TOPBAR ===== */}
      <header className="topbar">
        <h1 className="logo">ᨒ Flowee</h1>
        <nav className="nav-actions">
          <button className="btn-add">+ Add Transaction</button>
          <button className="btn-add">🌣</button>
          <button onClick={() => nav("/")} className="btn-logout">
            Logout
          </button>
        </nav>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="dashboard-main">
        {/* ===== SUMMARY CARDS ===== */}
        <section className="summary">
          <div className="card income-card">
            <h3>Income</h3>
            <p className="amount">€{incomeTotal}</p>
          </div>
          <div className="card expense-card">
            <h3>Expenses</h3>
            <p className="amount">€{expenseTotal}</p>
          </div>
          <div className="card balance-card">
            <h3>Balance</h3>
            <p className="amount">€{balance}</p>
          </div>
        </section>

        {/* ===== TRANSACTIONS LIST ===== */}
        <section className="transactions">
          <div className="transactions-header">
            <h2 className="title">Recent Transactions</h2>
            <div className="filter-div">
              <p className="subtitle">Filter:</p>
              <select className="filter">
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
            </div>
          </div>

          <ul className="transactions-list">
            {transactions.length === 0 ? (
              <p>No transactions available yet</p>
            ) : (
              transactions.map((t) => (
                <li key={t.id} className="transaction-item">
                  <span className="desc">{t.description}</span>
                  <span className="desc">{t.category}</span>
                  <span
                    className={
                      t.type === "income" ? "type income" : "type expense"
                    }
                  >
                    {t.type === "income" ? "+" : "-"} €{t.amount}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* ===== ANALYTICS (PLACEHOLDER FOR CHART) ===== */}
        <section className="analytics">
          <h2 className="title">Spending Overview</h2>
          <div className="chart-placeholder">📊 Chart area</div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="dashboard-footer">
        <p>
          © {new Date().getFullYear()} Flowee Finance — Designed by Artur Wagner
        </p>
      </footer>
    </div>
  );
}

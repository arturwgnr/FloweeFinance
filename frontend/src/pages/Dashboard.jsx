import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router";
import "../styles/dashboard.css";

export default function Dashboard() {
  const nav = useNavigate();
  const { user, token, logout } = useContext(AuthContext);

  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    title: "",
    amount: "",
    type: "",
    category: "",
  });

  function handleChange(e) {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  }

  async function fetchTransactions() {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data.transaction || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  function startEditing(transaction) {
    setEditingId(transaction.id);
    setNewTransaction({
      title: transaction.title,
      amount: String(transaction.amount),
      type: transaction.type,
      category: transaction.category,
    });
  }

  async function handleDeleteTransaction(id) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error deleting transaction");
    }
  }

  async function handleEditTransaction(e) {
    e.preventDefault();

    try {
      const res = await api.put(`/transactions/${editingId}`, newTransaction);
      const updated = res.data.transaction;

      setTransactions((prev) =>
        prev.map((t) => (t.id === editingId ? updated : t))
      );

      setNewTransaction({ title: "", amount: "", type: "", category: "" });
      setEditingId(null);
    } catch (error) {
      console.error(error);
      alert("Error editing transaction");
    }
  }

  async function handleAddTransaction(e) {
    e.preventDefault();

    try {
      const res = await api.post("/transactions", newTransaction);
      const created = res.data.transaction;

      setTransactions((prev) => [...prev, created]);
      setNewTransaction({ title: "", amount: "", type: "", category: "" });
    } catch (error) {
      console.error(error);
      alert("Error adding transaction");
    }
  }

  return (
    <div className="dashboard">
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

      <main className="main-content">
        <h3 className="welcome">
          Welcome back, {user ? user.username : "User"} 👋
        </h3>

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

        <section className="add-transaction glass">
          <h4>Add Transaction</h4>
          <form
            onSubmit={editingId ? handleEditTransaction : handleAddTransaction}
          >
            <select
              name="type"
              value={newTransaction.type}
              onChange={handleChange}
            >
              <option value="">Select type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newTransaction.title}
              onChange={handleChange}
            />

            <select
              name="category"
              value={newTransaction.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Housing">Housing</option>
              <option value="Shopping">Shopping</option>
              <option value="Salary">Salary</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={handleChange}
            />
            <button type="submit">{editingId ? "Save Changes" : "Add"}</button>
          </form>
        </section>
        <br />

        <section className="transactions glass">
          <h4>Your Transactions</h4>
          {transactions.length === 0 ? (
            <p className="no-transactions">No transactions yet.</p>
          ) : (
            <ul className="transaction-list">
              {transactions.map((t) => (
                <li key={t.id} className={`transaction-item ${t.type}`}>
                  <div className="transaction-info">
                    <h4>{t.title}</h4>
                    <span className="category">{t.category}</span>
                  </div>
                  <div className="amount">
                    {t.type === "income" ? "+" : "-"}€{t.amount}
                  </div>

                  <div className="buttons">
                    <button onClick={() => startEditing(t)}>Edit</button>
                    <button onClick={() => handleDeleteTransaction(t.id)}>
                      X
                    </button>
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

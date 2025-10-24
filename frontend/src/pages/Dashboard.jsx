import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate, Navigate } from "react-router";
import "../styles/dashboard.css";
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const nav = useNavigate();
  const { user, token, logout, loading, isAuthenticated } =
    useContext(AuthContext);

  console.log(token);

  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    title: "",
    amount: "",
    type: "",
    category: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  console.log(balance);

  function handleChange(e) {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  }

  async function fetchTransactions() {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  useEffect(() => {
    if (!loading && isAuthenticated) {
      fetchTransactions();
    }
  }, [loading, isAuthenticated]);

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
    toast(
      (t) => (
        <div style={{ color: "#282d3ce6" }}>
          <p>Delete this transaction?</p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "8px",
              justifyContent: "center", // centraliza horizontalmente
              alignItems: "center",
            }}
          >
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await api.delete(`/transactions/${id}`);
                  setTransactions((prev) => prev.filter((tr) => tr.id !== id));
                  toast.success("Transaction deleted!");
                } catch (error) {
                  console.error(error);
                  toast.error("Error deleting transaction!");
                }
              }}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                background: "#374151",
                color: "#fff",
                border: "none",
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  }

  async function handleEditTransaction(e) {
    e.preventDefault();

    if (
      !newTransaction.title ||
      !newTransaction.amount ||
      !newTransaction.type
    ) {
      toast.error("Please fill all fields before submiting!");
      return;
    }
    setIsLoading(true);

    try {
      const res = await api.put(`/transactions/${editingId}`, newTransaction);
      const updated = res.data.updated;

      setTransactions((prev) =>
        prev.map((t) => (t.id === editingId ? updated : t))
      );

      setNewTransaction({ title: "", amount: "", type: "", category: "" });
      toast.success("Transaction edited successfully!");
      setEditingId(null);
    } catch (error) {
      console.error(error);
      toast.error("Error editing transaction! Try again later");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddTransaction(e) {
    e.preventDefault();

    if (
      !newTransaction.title ||
      !newTransaction.amount ||
      !newTransaction.type
    ) {
      toast.error("Please fill all fields!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/transactions", newTransaction);
      const created = res.data.transaction;

      setTransactions((prev) => [...prev, created]);
      setNewTransaction({ title: "", amount: "", type: "", category: "" });
      toast.success("Transaction added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error adding transaction!");
    } finally {
      setIsLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="dashboard">
      <nav className="topbar glass">
        <Toaster position="top-center" reverseOrder={false} />
        <h2 className="logo">Flowee ᨒ</h2>
        <div className="user-area">
          <span className="username">{user ? user.username : "User"}</span>
          <button
            onClick={() => {
              logout();
              setTimeout(() => nav("/"), 150);
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
            <p>€{balance.toFixed()}</p>
          </div>
          <div className="summary-card glass">
            <h4>Income</h4>
            <p className="green">€{totalIncome}</p>
          </div>
          <div className="summary-card glass">
            <h4>Expenses</h4>
            <p className="red">€-{totalExpense}</p>
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

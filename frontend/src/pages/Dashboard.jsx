import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all"); // <- controle do select

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    type: "",
  });

  //UX Edits
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const username = localStorage.getItem("username");
  const nav = useNavigate();

  //-------------------------------------------------------------

  //Totais
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

  // Carregar dados
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await getTransactions(userId);
        setTransactions(res.data.transactions);
        setFilteredTransactions(res.data.transactions);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Atualiza filtro toda vez que o tipo muda
  useEffect(() => {
    if (filterType === "all") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter((t) => t.type === filterType)
      );
    }
  }, [filterType, transactions]);

  function handleOpenForm() {
    setFormData({ description: "", amount: "", category: "", type: "" });
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpened(true);
  }

  function handleIsEditing(id) {
    const selected = transactions.find((t) => t.id === id);
    setFormData({
      description: selected.description,
      amount: selected.amount,
      category: selected.category,
      type: selected.type,
    });
    setIsEditing(true);
    setEditingId(id);
    setIsModalOpened(true);
  }

  async function handleSubmitTransaction(e) {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    try {
      let res;

      if (isEditing) {
        res = await updateTransaction(editingId, formData);
        const updatedList = transactions.map((t) =>
          t.id === editingId ? res.data.updatedTransaction : t
        );
        setTransactions(updatedList);
        toast.success("Transaction updated successfully!");
      } else {
        res = await createTransaction(userId, formData);
        setTransactions([...transactions, res.data.newTransaction]);
        toast.success("Transaction added successfully!");
      }

      setFormData({ description: "", amount: "", category: "", type: "" });
      setIsModalOpened(false);
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error(error);
      toast.error("Error saving transaction");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTransaction(id);
      const updated = transactions.filter((t) => t.id !== id);
      setTransactions(updated);
    } catch (error) {
      console.error(error);
      toast.error("Error deleting task");
    }
  }

  return (
    <div className="dashboard">
      <header className="topbar">
        <h1 className="logo">ᨒ Flowee</h1>
        <nav className="nav-actions">
          <button className="btn-add-config">🌣</button>
          <button onClick={() => nav("/")} className="btn-logout">
            Logout
          </button>
        </nav>
      </header>

      <main className="dashboard-main">
        <h1 className="title">Welcome back, {username}</h1>

        <section className="summary">
          <div className="card income-card">
            <h3>Income</h3>
            {isLoading ? (
              <p className="loading">Loading...</p>
            ) : (
              <p className="amount">€{incomeTotal}</p>
            )}
          </div>
          <div className="card expense-card">
            <h3>Expenses</h3>
            {isLoading ? (
              <p className="loading">Loading...</p>
            ) : (
              <p className="amount">€{expenseTotal}</p>
            )}
          </div>
          <div className="card balance-card">
            <h3>Balance</h3>
            {isLoading ? (
              <p className="loading">Loading...</p>
            ) : (
              <p className="amount">€{balance}</p>
            )}
          </div>
        </section>

        <div className="transaction-area">
          <button onClick={handleOpenForm} className="btn-add">
            + Add Transaction
          </button>
        </div>

        <section className="transactions">
          <div className="transactions-header">
            <h2 className="title">Recent Transactions</h2>
            <div className="filter-div">
              <p className="subtitle">Filter:</p>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
              <p className="subtitle">Category:</p>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
            </div>
          </div>

          <ul className="transactions-list">
            {filteredTransactions.length === 0 ? (
              <p>No transactions available yet</p>
            ) : (
              filteredTransactions.map((t) => (
                <li key={t.id} className={`transaction-item ${t.type}`}>
                  <span className="desc">{t.description}</span>
                  <span className="desc">{t.category}</span>
                  <span
                    className={
                      t.type === "income" ? "type income" : "type expense"
                    }
                  >
                    {t.type === "income" ? "+" : "-"} €{t.amount}{" "}
                    <button
                      className="icon-btn-edit"
                      onClick={() => handleIsEditing(t.id)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="icon-btn-delete"
                      onClick={() => handleDelete(t.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="analytics">
          <h2 className="title">Spending Overview</h2>
          <div className="chart-placeholder">📊 Chart area</div>
        </section>
      </main>

      {isModalOpened && (
        <div className="modal-overlay" onClick={() => setIsModalOpened(false)}>
          <div
            className={
              isModalOpened ? "modal-container open" : "modal-container"
            }
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">
              {isEditing ? "Edit Transaction" : "Add Transaction"}
            </h2>

            <form onSubmit={handleSubmitTransaction} className="modal-form">
              <input
                value={formData.description}
                name="description"
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                type="text"
                placeholder="Name"
              />
              <input
                value={formData.amount}
                name="amount"
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                type="number"
                placeholder="Amount (€)"
              />
              <select
                name="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
              >
                <option value="">Select type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input
                value={formData.category}
                name="category"
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                type="text"
                placeholder="Category"
              />

              <div className="modal-buttons">
                <button type="submit" className="btn-confirm">
                  {isEditing ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpened(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="dashboard-footer">
        <p>
          © {new Date().getFullYear()} Flowee Finance — Designed by Artur Wagner
        </p>
      </footer>
    </div>
  );
}

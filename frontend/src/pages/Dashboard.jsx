import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../services/api";
import SpendingOverview from "../components/SpendingOverview";
import RevenueTrend from "../components/RevenueTrend";
import AiFinanceChat from "../components/AiFinanceChat";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    type: "",
    date: "",
  });

  //UX Edits
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  //Date Filters
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const username = localStorage.getItem("username");
  const nav = useNavigate();

  //Categories
  const incomeCategories = ["Salary", "Bonus", "Investiment", "Other"];
  const expenseCategories = ["Food", "Bills", "Shopping", "House", "Other"];

  //Transaction form
  const [keepOpen, setKeepOpen] = useState(false);

  //Delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  //-------------------------------------------------------

  //Graphics
  const [currentAnalyticsView, setCurrentAnalyticsView] = useState(0);

  const analyticsViews = [
    <SpendingOverview filteredTransactions={filteredTransactions} />,
    <RevenueTrend allTransactions={allTransactions} />,
    <AiFinanceChat />,
  ];

  function handleAnalyticsNav(direction) {
    setCurrentAnalyticsView((prev) => {
      if (direction === "left") {
        return prev === 0 ? analyticsViews.length - 1 : prev - 1;
      } else {
        return prev === analyticsViews.length - 1 ? 0 : prev + 1;
      }
    });
  }

  //-------------------------------------------------------

  //Totals
  const incomeTotal = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0)
    .toFixed(2);

  const expenseTotal = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0)
    .toFixed(2);

  const balance = allTransactions
    .reduce((acc, t) => {
      if (t.type === "income") return acc + t.amount;
      if (t.type === "expense") return acc - t.amount;
      return acc;
    }, 0)
    .toFixed(2);

  //Load data
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (isNaN(currentMonth) || isNaN(currentYear)) return;

    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await getTransactions(
          userId,
          currentMonth + 1,
          currentYear
        );
        setTransactions(res.data.transactions);
        setFilteredTransactions(res.data.transactions);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [currentMonth, currentYear]);

  //Load all transactions
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    async function fetchAllTransactions() {
      setIsLoading(true);
      try {
        const res = await getTransactions(userId);

        setAllTransactions(res.data.transactions);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAllTransactions();
  }, []);

  //General Filter
  useEffect(() => {
    if (filterType === "all") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter((t) => t.type === filterType)
      );
    }
  }, [filterType, transactions]);

  //Category filter
  useEffect(() => {
    let filtered = [...transactions];

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    setFilteredTransactions(filtered);
  }, [filterType, filterCategory, transactions]);

  //-------------------------------------------------------------

  //Functions

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
        setAllTransactions([...allTransactions, res.data.newTransaction]);
        toast.success("Transaction added successfully!");
      }

      // Recarrega todas as transações para atualizar o balance global
      const allRes = await getTransactions(userId);
      setAllTransactions(allRes.data.transactions);

      setFormData({ description: "", amount: "", category: "", type: "" });
      if (!keepOpen) {
        setIsModalOpened(false);
      }
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
      setAllTransactions(allTransactions.filter((t) => t.id !== id));
      toast.success("Transaction deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting task");
    }
  }

  function handleArrowNavRight() {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
    console.log(currentMonth);
  }
  function handleArrowNavLeft() {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
    console.log(currentMonth);
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
              <p className="user-message">Loading...</p>
            ) : (
              <p className="amount">€{incomeTotal}</p>
            )}
          </div>
          <div className="card expense-card">
            <h3>Expenses</h3>
            {isLoading ? (
              <p className="user-message">Loading...</p>
            ) : (
              <p className="amount">€{expenseTotal}</p>
            )}
          </div>
          <div className="card balance-card">
            <h3>Balance</h3>
            {isLoading ? (
              <p className="user-message">Loading...</p>
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
          <div className="nav-arrows">
            <h1 onClick={handleArrowNavLeft} className="left-arrow">{`❮`}</h1>
            <h2 className="current-month">{`${monthNames[currentMonth]} ${currentYear}`}</h2>
            <h1
              onClick={handleArrowNavRight}
              className="right-arrow"
            >{`❯ `}</h1>
          </div>
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
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter"
              >
                <option value="all">All Categories</option>
                {Array.from(new Set(transactions.map((t) => t.category))).map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <ul className="transactions-list">
            {isLoading ? (
              <p className="user-message">Loading transactions...</p>
            ) : filteredTransactions.length === 0 ? (
              <p className="user-message">No transactions available.</p>
            ) : (
              filteredTransactions.map((t) => (
                <li key={t.id} className={`transaction-item ${t.type}`}>
                  <span className="desc">{t.description}</span>
                  <span className="desc">{t.category}</span>
                  <span className="desc date">
                    {new Date(t.date).toLocaleDateString()}
                  </span>
                  <span
                    className={
                      t.type === "income" ? "type income" : "type expense"
                    }
                  >
                    {t.type === "income" ? "+" : "-"} €{t.amount}
                    <button
                      className="icon-btn-edit"
                      onClick={() => handleIsEditing(t.id)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="icon-btn-delete"
                      onClick={() => setDeleteId(t.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </span>
                </li>
              ))
            )}
          </ul>

          {deleteId && (
            <div className="confirm-overlay" onClick={() => setDeleteId(null)}>
              <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
                <p>Are you sure you want to delete this transaction?</p>
                <div className="confirm-buttons">
                  <button
                    className="btn-confirm"
                    onClick={async () => {
                      await handleDelete(deleteId);
                      setDeleteId(null);
                    }}
                  >
                    Yes, delete
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => setDeleteId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="analytics">
          <div className="nav-arrows">
            <h1
              onClick={() => handleAnalyticsNav("left")}
              className="left-arrow"
            >
              {"❮"}
            </h1>
            <h2 className="title">
              {currentAnalyticsView === 0
                ? "Spending Overview"
                : currentAnalyticsView === 1
                ? "Revenue Trend"
                : "AI Finance Chat"}
            </h2>
            <h1
              onClick={() => handleAnalyticsNav("right")}
              className="right-arrow"
            >
              {"❯"}
            </h1>
          </div>

          <div className="analytics-content">
            {analyticsViews[currentAnalyticsView]}
          </div>
        </section>
      </main>

      {/* Transaction form */}
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
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                name="category"
              >
                <option value="">Select Category</option>
                {(formData.type === "income"
                  ? incomeCategories
                  : expenseCategories
                ).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                className="input-date"
                type="date"
                name="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
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
              <label className="keep-open">
                <input
                  type="checkbox"
                  checked={keepOpen}
                  onChange={() => setKeepOpen(!keepOpen)}
                />
                Keep this window open
              </label>
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

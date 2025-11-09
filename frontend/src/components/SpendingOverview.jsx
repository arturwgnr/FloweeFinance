import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "../styles/SpendingOverview.css";

export default function SpendingOverview({ filteredTransactions }) {
  // --- Agrupando por categoria (apenas despesas) ---
  const expenseByCategory = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const chartDataExpense = Object.entries(expenseByCategory).map(
    ([category, total]) => ({ category, total })
  );

  // --- Totais gerais (para o gráfico de barras) ---
  const incomeTotal = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expenseTotal = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const chartDataBar = [
    { name: "Comparison", income: incomeTotal, expense: expenseTotal },
  ];

  // --- Cores fixas ---
  const COLORS = ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff"];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        gap: "2rem",
        flexWrap: "wrap",
      }}
    >
      {/* ----- Pie Chart: Expenses by Category ----- */}
      <div>
        <h3 className="user-message" style={{ textAlign: "center" }}>
          Expenses by Category
        </h3>
        <PieChart width={300} height={250}>
          <Pie
            data={chartDataExpense}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {chartDataExpense.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* ----- Bar Chart: Income vs Expense ----- */}
      <div>
        <h3 className="user-message" style={{ textAlign: "center" }}>
          Income vs Expense
        </h3>
        <BarChart width={350} height={250} data={chartDataBar}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" name="Income" fill="#58c173" barSize={40} />
          <Bar dataKey="expense" name="Expense" fill="#ff4d4d" barSize={40} />
        </BarChart>
      </div>
    </div>
  );
}

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import "../styles/RevenueTrend.css";

export default function RevenueTrend({ allTransactions }) {
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

  const monthlyData = monthNames.map((month) => ({
    month,
    income: 0,
    expense: 0,
  }));

  if (!allTransactions || allTransactions.length === 0)
    return <p>Loading...</p>;

  const aggregated = allTransactions.reduce((acc, t) => {
    const monthIndex = new Date(t.date).getMonth();
    const updated = [...acc];
    if (t.type === "income") updated[monthIndex].income += t.amount;
    if (t.type === "expense") updated[monthIndex].expense += t.amount;
    return updated;
  }, monthlyData);

  const chartData = aggregated.filter((m) => m.income > 0 || m.expense > 0);

  console.log(chartData);
  console.table(aggregated);

  return (
    <div className="revenue-trend" style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#58c173"
            strokeWidth={3}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ff4d4d"
            strokeWidth={3}
            name="Expense"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

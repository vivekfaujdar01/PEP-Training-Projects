// src/components/SpendingCharts.jsx
import { useMemo, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

// Palette for pie/bar slices
const COLORS = [
  "#14b8a6", "#06b6d4", "#3b82f6", "#8b5cf6",
  "#ec4899", "#f43f5e", "#f97316", "#eab308",
  "#22c55e", "#64748b",
];

// Format rupee amounts concisely for axis labels
function fmtK(n) {
  if (n >= 1_000_000) return "₹" + (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return "₹" + (n / 1_000).toFixed(1) + "k";
  return "₹" + n;
}

// Full rupee format for tooltips
function fmt(n) {
  return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

// Month label from "YYYY-MM-DD"
function toMonthLabel(dateStr) {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleString("en-IN", { month: "short", year: "2-digit" });
}

// ── Custom Tooltip for Pie ──────────────────────────────────────────────────
function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="px-3 py-2 rounded-lg text-sm shadow-lg bg-white dark:bg-[#0d1530] border border-teal-100 dark:border-cyan-900/40 text-slate-700 dark:text-cyan-100">
      <p className="font-semibold">{name}</p>
      <p className="text-rose-500 dark:text-rose-400">{fmt(value)}</p>
    </div>
  );
}

// ── Custom Tooltip for Bar ──────────────────────────────────────────────────
function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg text-sm shadow-lg bg-white dark:bg-[#0d1530] border border-teal-100 dark:border-cyan-900/40 text-slate-700 dark:text-cyan-100">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function SpendingCharts({ transactions }) {
  const [activeChart, setActiveChart] = useState("pie");

  // Pie data — expenses grouped by category
  const pieData = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Bar data — monthly income vs expense
  const barData = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const key = toMonthLabel(t.date);
      if (!map[key]) map[key] = { month: key, Income: 0, Expense: 0 };
      if (t.type === "income") map[key].Income += t.amount;
      else map[key].Expense += t.amount;
    });
    // Sort chronologically by original date
    const sorted = {};
    transactions
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach((t) => {
        const key = toMonthLabel(t.date);
        if (!sorted[key] && map[key]) sorted[key] = map[key];
      });
    return Object.values(sorted);
  }, [transactions]);

  const hasExpenses = pieData.length > 0;
  const hasBar = barData.length > 0;

  if (!hasExpenses && !hasBar) return null;

  const cardCls =
    "bg-white/80 dark:bg-[rgba(15,25,60,0.7)] border border-teal-100 dark:border-cyan-900/30 rounded-xl p-5 shadow-sm";

  return (
    <section className="mb-8 space-y-4">
      {/* Tab Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveChart("pie")}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-200 cursor-pointer ${
            activeChart === "pie"
              ? "bg-teal-50 dark:bg-cyan-900/30 border-teal-400 dark:border-cyan-500 text-teal-600 dark:text-cyan-300"
              : "border-teal-100 dark:border-cyan-900/30 text-slate-500 dark:text-cyan-500/60 hover:border-teal-300"
          }`}
        >
          Expense Breakdown
        </button>
        <button
          onClick={() => setActiveChart("bar")}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-200 cursor-pointer ${
            activeChart === "bar"
              ? "bg-teal-50 dark:bg-cyan-900/30 border-teal-400 dark:border-cyan-500 text-teal-600 dark:text-cyan-300"
              : "border-teal-100 dark:border-cyan-900/30 text-slate-500 dark:text-cyan-500/60 hover:border-teal-300"
          }`}
        >
          Monthly Overview
        </button>
      </div>

      {/* ── Pie Chart ─────────────────────────────────────────────────── */}
      {activeChart === "pie" && (
        <div className={cardCls}>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-teal-500 dark:text-cyan-500/70 mb-4">
            Expenses by Category
          </h3>
          {hasExpenses ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={115}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-slate-600 dark:text-cyan-200/80">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-center py-10 text-slate-400 dark:text-cyan-500/50">
              No expense data yet.
            </p>
          )}
        </div>
      )}

      {/* ── Bar Chart ─────────────────────────────────────────────────── */}
      {activeChart === "bar" && (
        <div className={cardCls}>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-teal-500 dark:text-cyan-500/70 mb-4">
            Income vs. Expenses — Monthly
          </h3>
          {hasBar ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} barCategoryGap="30%" barGap={4}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.15)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={fmtK}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-slate-600 dark:text-cyan-200/80">
                      {value}
                    </span>
                  )}
                />
                <Bar dataKey="Income" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-center py-10 text-slate-400 dark:text-cyan-500/50">
              No transaction data yet.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

// src/components/TransactionList.jsx
import { useState } from "react";
import TransactionItem from "./TransactionItem";
import { Search, Inbox } from "lucide-react";

import { CATEGORIES } from "../utils/constants";
import { selectCls } from "../utils/styles";

export default function TransactionList({ transactions }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");

  const filtered = transactions
    .filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || t.type === filterType;
      const matchCat = filterCategory === "All" || t.category === filterCategory;
      return matchSearch && matchType && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "date-desc") return b.date.localeCompare(a.date);
      if (sortBy === "date-asc") return a.date.localeCompare(b.date);
      if (sortBy === "amount-desc") return b.amount - a.amount;
      if (sortBy === "amount-asc") return a.amount - b.amount;
      return 0;
    });

  return (
    <div className="flex flex-col gap-4">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-xl bg-white/80 dark:bg-[rgba(15,25,60,0.7)] border border-teal-100 dark:border-cyan-900/30 backdrop-blur-sm">
        {/* Search */}
        <div className="relative flex-1 w-full sm:w-auto sm:min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400 dark:text-cyan-600" />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none bg-teal-50 dark:bg-[rgba(10,20,50,0.8)] border border-teal-200 dark:border-cyan-800/50 text-slate-700 dark:text-cyan-100 placeholder:text-teal-400/60 dark:placeholder:text-cyan-700 focus:border-teal-400 dark:focus:border-cyan-400 transition-colors duration-200"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Selects */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          <select className={`${selectCls} w-full sm:w-auto`} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className={`${selectCls} w-full sm:w-auto`} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className={`${selectCls} w-full sm:w-auto col-span-2 sm:col-span-1`} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* List Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-cyan-100">Transactions</h2>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-cyan-900/30 border border-teal-200 dark:border-cyan-800/50 text-teal-600 dark:text-cyan-400">
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-white/60 dark:bg-[rgba(15,25,60,0.5)] border border-dashed border-teal-200 dark:border-cyan-900/40 text-teal-400 dark:text-cyan-700">
          <Inbox className="w-10 h-10 mx-auto mb-2 text-teal-300 dark:text-cyan-800" />
          <p className="text-sm">No transactions found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((t) => (
            <TransactionItem key={t.id} transaction={t} />
          ))}
        </div>
      )}
    </div>
  );
}

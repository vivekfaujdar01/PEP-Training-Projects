// src/components/TransactionForm.jsx
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

import { CATEGORIES } from "../utils/constants";
import { inputCls, labelCls } from "../utils/styles";

export default function TransactionForm({ onClose }) {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "income",
    category: "Salary",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.amount || Number(form.amount) <= 0) {
      setError("Please fill in a valid title and amount.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await addDoc(
        collection(db, "users", currentUser.uid, "transactions"),
        {
          title: form.title.trim(),
          amount: parseFloat(form.amount),
          type: form.type,
          category: form.category,
          date: form.date,
          note: form.note.trim(),
          createdAt: serverTimestamp(),
        }
      );
      setForm({
        title: "",
        amount: "",
        type: "income",
        category: "Salary",
        date: new Date().toISOString().split("T")[0],
        note: "",
      });
      if (onClose) onClose();
    } catch (err) {
      setError("Failed to add transaction. Try again.");
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className="text-lg font-bold text-slate-800 dark:text-cyan-100">Add Transaction</h2>

      {error && (
        <p className="px-3 py-2 rounded-lg text-sm bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700/50 text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}

      {/* Row 1: Title + Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Title / Description</label>
          <input className={inputCls} name="title" value={form.title} onChange={handleChange} placeholder="e.g. Monthly Salary" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Amount (₹)</label>
          <input className={inputCls} name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} placeholder="0.00" required />
        </div>
      </div>

      {/* Row 2: Type + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Type</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, type: "income" }))}
              className={`
                flex-1 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 cursor-pointer
                ${form.type === "income"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-600 dark:text-emerald-400"
                  : "bg-teal-50 dark:bg-[rgba(10,20,50,0.8)] border-teal-200 dark:border-cyan-800/50 text-teal-500 dark:text-cyan-500 hover:border-emerald-300"
                }
              `}
            >
              ↑ Income
            </button>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, type: "expense" }))}
              className={`
                flex-1 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 cursor-pointer
                ${form.type === "expense"
                  ? "bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-600 dark:text-rose-400"
                  : "bg-teal-50 dark:bg-[rgba(10,20,50,0.8)] border-teal-200 dark:border-cyan-800/50 text-teal-500 dark:text-cyan-500 hover:border-rose-300"
                }
              `}
            >
              ↓ Expense
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Category</label>
          <select
            className={inputCls}
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Row 3: Date + Note */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Date</label>
          <input className={inputCls} name="date" type="date" value={form.date} onChange={handleChange} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Note (optional)</label>
          <input className={inputCls} name="note" value={form.note} onChange={handleChange} placeholder="Any extra details..." />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm border border-teal-200 dark:border-cyan-800 text-teal-600 dark:text-cyan-400 hover:border-rose-400 hover:text-rose-500 transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg text-base font-bold text-white bg-linear-to-r from-teal-400 to-cyan-500 dark:from-cyan-400 dark:to-sky-500 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md cursor-pointer"
        >
          {loading ? "Saving..." : "Add Transaction"}
        </button>
      </div>
    </form>
  );
}

// src/components/TransactionItem.jsx
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Package, Pencil, Trash2 } from "lucide-react";
import { CATEGORIES, CATEGORY_ICONS } from "../utils/constants";
import { compactInputCls } from "../utils/styles";



export default function TransactionItem({ transaction }) {
  const { currentUser } = useAuth();
  const { id, title, amount, type, category, date, note } = transaction;
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title, amount, type, category, date, note: note || "" });
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Delete this transaction?")) return;
    await deleteDoc(doc(db, "users", currentUser.uid, "transactions", id));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", currentUser.uid, "transactions", id), {
        title: editForm.title.trim(),
        amount: parseFloat(editForm.amount),
        type: editForm.type,
        category: editForm.category,
        date: editForm.date,
        note: editForm.note.trim(),
      });
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const isIncome = type === "income";
  const borderColor = isIncome
    ? "border-l-emerald-400 dark:border-l-emerald-400"
    : "border-l-rose-400";

  if (editing) {
    return (
      <div className="rounded-xl p-4 bg-white dark:bg-[rgba(15,25,60,0.8)] border border-teal-100 dark:border-cyan-900/30 backdrop-blur-sm">
        <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-2">
          <input className={compactInputCls} value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" required />
          <input className={compactInputCls} type="number" value={editForm.amount} onChange={(e) => setEditForm((p) => ({ ...p, amount: e.target.value }))} placeholder="Amount" min="0.01" step="0.01" required />
          <select className={compactInputCls} value={editForm.type} onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value }))}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className={compactInputCls} value={editForm.category} onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input className={compactInputCls} type="date" value={editForm.date} onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))} required />
          <input className={compactInputCls} value={editForm.note} onChange={(e) => setEditForm((p) => ({ ...p, note: e.target.value }))} placeholder="Note" />
          <div className="col-span-2 flex gap-2 justify-end mt-1">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-teal-400 to-cyan-500 dark:from-cyan-400 dark:to-sky-500 hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-1.5 rounded-lg text-sm border border-teal-200 dark:border-cyan-800 text-teal-600 dark:text-cyan-400 hover:border-rose-400 hover:text-rose-500 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 px-6 py-5 rounded-xl bg-white/80 dark:bg-[rgba(15,25,60,0.7)] border border-teal-100 dark:border-cyan-900/30 border-l-4 ${borderColor} backdrop-blur-sm hover:bg-teal-50/80 dark:hover:bg-[rgba(20,35,75,0.85)] hover:translate-x-0.5 transition-all duration-200`}>
      {/* Icon */}
      <span className="w-10 flex items-center justify-center shrink-0">
        {(() => { const Icon = CATEGORY_ICONS[category] || Package; return <Icon className="w-6 h-6 text-teal-500 dark:text-cyan-400" />; })()}
      </span>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <span className="text-lg font-semibold text-slate-800 dark:text-cyan-100 truncate">{title}</span>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-cyan-900/30 border border-teal-200 dark:border-cyan-800/50 text-teal-600 dark:text-cyan-400">
            {category}
          </span>
          <span className="text-xs text-teal-400/70 dark:text-cyan-700">{date}</span>
          {note && <span className="text-xs italic text-teal-400/60 dark:text-cyan-800">"{note}"</span>}
        </div>
      </div>

      {/* Amount + Actions */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className={`text-lg font-bold ${isIncome ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
          {isIncome ? "+" : "-"}₹{Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => setEditing(true)}
            title="Edit"
            className="p-2 rounded-md border border-teal-200 dark:border-cyan-800/50 hover:border-teal-400 dark:hover:border-cyan-400 hover:bg-teal-50 dark:hover:bg-cyan-900/30 transition-all cursor-pointer"
          ><Pencil className="w-4 h-4 text-teal-500 dark:text-cyan-400" /></button>
          <button
            onClick={handleDelete}
            title="Delete"
            className="p-2 rounded-md border border-teal-200 dark:border-cyan-800/50 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
          ><Trash2 className="w-4 h-4 text-teal-500 dark:text-rose-400" /></button>
        </div>
      </div>
    </div>
  );
}

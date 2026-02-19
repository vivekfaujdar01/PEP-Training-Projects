// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import { AlertTriangle, CreditCard, TrendingUp, TrendingDown, Plus } from "lucide-react";
import SpendingCharts from "../components/SpendingCharts";
import Footer from "../components/Footer";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "users", currentUser.uid, "transactions"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [currentUser]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  function fmt(n) {
    return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#edfaf6] dark:bg-[#0a0f1e] transition-colors duration-300">
      <Navbar />

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 pb-24">

        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Balance Card */}
          <div className={`
            flex items-center gap-4 p-6 rounded-xl border
            backdrop-blur-sm shadow-sm
            transition-all duration-200 hover:-translate-y-0.5
            ${balance < 0
              ? "bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50 border-t-4 border-t-rose-400"
              : "bg-white/80 dark:bg-[rgba(15,25,60,0.7)] border-teal-100 dark:border-cyan-900/30 border-t-4 border-t-teal-400 dark:border-t-cyan-400"
            }
          `}>
            <span className="shrink-0">{balance < 0 ? <AlertTriangle className="w-8 h-8 text-rose-400" /> : <CreditCard className="w-8 h-8 text-teal-400 dark:text-cyan-400" />}</span>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-teal-500 dark:text-cyan-500/70">Total Balance</span>
              <span className={`text-2xl font-bold ${balance < 0 ? "text-rose-500" : "text-slate-800 dark:text-cyan-100"}`}>
                {fmt(balance)}
              </span>
            </div>
          </div>

          {/* Income Card */}
          <div className="flex items-center gap-4 p-6 rounded-xl border-t-4 bg-white/80 dark:bg-[rgba(15,25,60,0.7)] border border-teal-100 dark:border-cyan-900/30 border-t-emerald-400 dark:border-t-emerald-400 backdrop-blur-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5">
            <TrendingUp className="w-8 h-8 shrink-0 text-emerald-400" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-teal-500 dark:text-cyan-500/70">Total Income</span>
              <span className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">{fmt(totalIncome)}</span>
            </div>
          </div>

          {/* Expense Card */}
          <div className="flex items-center gap-4 p-6 rounded-xl border-t-4 bg-white/80 dark:bg-[rgba(15,25,60,0.7)] border border-teal-100 dark:border-cyan-900/30 border-t-rose-400 backdrop-blur-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5">
            <TrendingDown className="w-8 h-8 shrink-0 text-rose-400" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-teal-500 dark:text-cyan-500/70">Total Expenses</span>
              <span className="text-2xl font-bold text-rose-500 dark:text-rose-400">{fmt(totalExpense)}</span>
            </div>
          </div>
        </section>

        {/* Overspending Warning */}
        {balance < 0 && (
          <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700/50 animate-fade-in">
            <AlertTriangle className="shrink-0 w-6 h-6 text-rose-500 dark:text-rose-400" />
            <div className="flex flex-col gap-0.5">
              <strong className="text-base text-rose-600 dark:text-rose-400">You're overspending!</strong>
              <span className="text-sm text-rose-500/80 dark:text-rose-400/70">
                Expenses exceed income by {fmt(Math.abs(balance))}. Review your spending.
              </span>
            </div>
          </div>
        )}

        {/* Spending Charts */}
        {!loading && transactions.length > 0 && (
          <SpendingCharts transactions={transactions} />
        )}

        {/* Transaction List */}
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16 text-teal-400 dark:text-cyan-500">
            <div className="w-9 h-9 rounded-full border-2 border-teal-200 dark:border-cyan-800 border-t-teal-500 dark:border-t-cyan-400 animate-spin-slow" />
            <p className="text-sm">Loading transactions...</p>
          </div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        title="Add Transaction"
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-white bg-linear-to-br from-teal-400 to-cyan-500 dark:from-cyan-400 dark:to-sky-500 shadow-lg shadow-teal-300/40 dark:shadow-cyan-500/30 hover:scale-110 hover:rotate-45 transition-all duration-200 z-50 cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="w-full max-w-lg rounded-xl p-6 bg-white dark:bg-[#0d1530] border border-teal-100 dark:border-cyan-900/40 shadow-xl animate-slide-up">
            <TransactionForm onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

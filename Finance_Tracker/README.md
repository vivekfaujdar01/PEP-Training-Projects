# 💰 Finance Tracker

A modern, full-stack personal finance dashboard built with **React**, **Firebase**, and **Tailwind CSS**. Track your income, expenses, and spending patterns with real-time sync — all secured behind user authentication.

---

## 🚀 Live Demo

> Deploy your own via [Vercel](https://vercel.com) (see [Deployment](#deployment) section below).

---

## ✨ Features

- 🔐 **Authentication** — Secure sign-up / login with Firebase Auth
- 📊 **Dashboard** — Real-time summary of balance, total income & total expenses
- ➕ **Add Transactions** — Log income or expense entries with amount, category, and notes
- ✏️ **Edit & Delete** — Update or remove any transaction directly from the list
- 📈 **Spending Charts** — Visual breakdown of income vs. expenses using pie/bar charts (Recharts)
- ⚠️ **Overspending Alert** — Instant warning when expenses exceed income
- 🌙 **Dark / Light Mode** — Smooth theme toggle with persistent preference
- 📱 **Fully Responsive** — Optimised layout for mobile, tablet, and desktop
- ☁️ **Real-time Sync** — Firestore keeps data in sync across sessions instantly

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Charts | Recharts |
| Backend / DB | Firebase Firestore |
| Auth | Firebase Authentication |
| Build Tool | Vite |
| Deployment | Vercel |

---

## 📁 Project Structure

```
Finance_Tracker/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Top navigation bar with theme toggle & logout
│   │   ├── ProtectedRoute.jsx    # Guards routes from unauthenticated access
│   │   ├── SpendingCharts.jsx    # Recharts-based income/expense visualisation
│   │   ├── TransactionForm.jsx   # Add/edit transaction modal form
│   │   ├── TransactionItem.jsx   # Individual transaction card with edit/delete
│   │   └── TransactionList.jsx   # Renders the full list of transactions
│   ├── context/
│   │   ├── AuthContext.jsx       # Firebase auth state context
│   │   └── ThemeContext.jsx      # Dark/light mode state context
│   ├── pages/
│   │   ├── Dashboard.jsx         # Main app page after login
│   │   ├── Login.jsx             # Login page
│   │   └── Register.jsx          # Registration page
│   ├── utils/                    # Shared utility helpers
│   ├── firebase.js               # Firebase app initialisation
│   ├── App.jsx                   # Root component with routing
│   ├── main.jsx                  # React DOM entry point
│   └── index.css                 # Global styles & Tailwind config
├── index.html
├── vite.config.js
├── vercel.json                   # Vercel SPA routing config
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A [Firebase](https://firebase.google.com/) project with **Authentication** and **Firestore** enabled

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and add your Firebase config values:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ **Never commit your `.env` file.** It is already included in `.gitignore`.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Email/Password** sign-in under **Authentication → Sign-in method**.
3. Create a **Firestore Database** in production mode.
4. Add this security rule to restrict data to authenticated owners:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/transactions/{transactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to a GitHub repository.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add all `VITE_FIREBASE_*` environment variables in the Vercel project settings.
4. Click **Deploy**.

The included `vercel.json` handles client-side routing automatically.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

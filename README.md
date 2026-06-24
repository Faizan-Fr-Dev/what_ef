# What Ef? — AI Comic E-Commerce & Fan Dashboard

A modern, full-stack web application for an AI-generated comic e-commerce platform and fan interaction hub. The application features a dynamic comic catalog, interactive voting polls, custom edition requests, and a comprehensive admin management dashboard.

---

## 🚀 Live Demo & Deployments
- **Frontend (UI)**: Deployed on [Vercel](https://vercel.com/)
- **Backend (API)**: Deployed on [Railway](https://railway.app/)

---

## ✨ Features

### 📖 Fan E-Commerce
- **Comics Catalog**: Browse through AI-generated comics with prices, sales statistics, and details.
- **Series Bundles**: Purchase curated comic collections at a discounted price.
- **Gumroad Checkout**: Direct checkout redirection to Gumroad listings for safe and secure digital delivery.

### 🗳️ Fan Interaction
- **Interactive Polls**: View active and closed fan polls. Register or log in to vote on storyline twists, character names, and future releases.
- **Custom Editions**: Request custom cover designs or personalized comic editions using external avatar assets.
- **Newsletter Subscription**: Subscribe to receive email updates and promotions.

### 🛡️ Admin Dashboard
- **User Management**: Monitor users, delete accounts, and manage user roles (Admin vs. Standard User vs. Guest).
- **Comic Management**: Full CRUD operations to add, edit, or remove comics.
- **Bundle Builder**: Group individual comics into custom discounted series bundles.
- **Poll Builder**: Create and launch new interactive polls with custom options.
- **Custom Requests Manager**: Review and track the delivery status (`Pending`, `In Progress`, `Delivered`) of fan custom edition requests.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React (v19) | Modern component-based User Interface |
| | React Router Dom (v7) | Declarative client-side routing |
| | Vite (v6) | Ultra-fast next-generation frontend tooling |
| | Tailwind CSS | Sleek utility-first styling |
| **Backend** | Node.js & Express | Lightweight RESTful API server |
| | SQLite3 | Local SQL database for storage |
| | BCryptJS | Secure password hashing for account security |
| | Cors | Cross-Origin Resource Sharing middleware |
| **Local Run** | Concurrently | Run frontend and backend servers together |

---

## 📂 Project Structure

```text
What-Ef/
├── api/
│   └── index.js          # Vercel serverless function entry bridge
├── backend/
│   ├── database/
│   │   └── database.db   # SQLite database file
│   ├── db.js             # Database schema, initialization, and seed scripts
│   ├── index.js          # Express API server (routes, middleware, CORS)
│   └── package.json      # Backend dependencies and startup scripts
├── frontend/
│   ├── components/       # Reusable UI components (Navbar, Footer, ComicCard, etc.)
│   ├── context/          # React contexts (AuthContext, ToastContext)
│   ├── pages/            # Application views (Catalog, Polls, Admin Dashboard, etc.)
│   ├── services/
│   │   └── api.js        # API client client for backend communications
│   ├── vite.config.js    # Vite dev and build settings
│   └── package.json      # Frontend React dependencies
├── vercel.json           # Vercel deployment routes and rewrites config
└── package.json          # Root-level local development orchestrator
```

---

## 💻 Local Setup

Run the application locally on your machine:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed (v18 or higher recommended).
- Git installed.

### 2. Clone the Repository
```bash
git clone https://github.com/Faizan-Fr-Dev/What-ef.git
cd What-ef
```

### 3. Install All Dependencies
Install root, frontend, and backend packages in one command:
```bash
npm run install:all
```

### 4. Run Both Servers Concurrently
Start the Express server (port `3008`) and the Vite development server (port `3005`) simultaneously:
```bash
npm run dev
```

Open **[http://localhost:3005](http://localhost:3005)** in your browser to view the application.

---

## ☁️ Deployment

### Backend (Railway)
1. Link your GitHub repository to [Railway](https://railway.app/).
2. In the Service settings, configure the **Root Directory** to `/backend`.
3. Railway will read `/backend/package.json` and automatically build and deploy the container.
4. Ensure you generate a Domain/URL under your service (e.g. `https://your-backend.up.railway.app`).

### Frontend (Vercel)
1. Import your repository into [Vercel](https://vercel.com/).
2. In the Project Settings:
   - Set the **Root Directory** to `frontend`.
   - Vercel will automatically detect Vite and set the build command to `npm run build` and output directory to `dist`.
3. Set up the Environment Variables (optional, defaults to local/Railway fallback) or let the dynamic base URL routing handle it.

# Mesob Market — Full-Stack E-Commerce & Community Platform

Mesob Market is a full-featured e-commerce platform built with React 19, Express 5, and MongoDB. Tailored with localized payment processing via Chapa (ETB currency) and an intelligent AI shopping curator powered by Google Gemini, the platform delivers a modern shopping experience alongside social community features and an admin management suite.

---

## Author

**Name:** Firomsa Girma Worku  
**Student ID:** CTC-2559-26

**Project:** Mesob Market — Full-Stack E-Commerce Platform
**Project Video Link on Google Drive:** :  https://docs.google.com/videos/d/1lpMEgg-Rj6fqGArnpsOra3BRtqBN0pL41lGGjfdW8Ww/play


## 🌟 Key Features

### Customer Shopping Experience
- **Dynamic Product Catalog:** Live search with debounced querying, multi-attribute filtering (category, price range, condition status), and pagination.
- **Rich Product Detail View:** Image gallery with cover and detail previews, dynamic discount pricing calculation, stock availability badges, and color selection.
- **Verified Customer Reviews:** 1–5 star ratings and reviews restricted to confirmed purchasers with automated rating score aggregation.
- **Cart & Order Lifecycle:** Persistent shopping cart, item quantity updates, real-time subtotal calculation, and order tracking history.
- **Chapa Payment Gateway:** Secure Ethiopian Birr (ETB) transaction checkout with cryptographic webhook verification.
- **RAG AI Shopping Assistant:** Conversational AI shopping advisor powered by Google Gemini and Fuse.js fuzzy catalog matching.
- **Community Social Feed:** Discussion feed allowing users to share shopping tips, reviews, and ideas with likes, reposts, comments, and moderation reporting.
- **Progressive Web App (PWA):** Installable web app with responsive mobile navigation and offline service-worker caching.

### Administrative Control Center
- **Executive Dashboard:** Live 7-day sales charts, order counts, customer acquisition metrics, and recent order history.
- **Inventory Management:** Full CRUD operations for products with Cloudinary multi-image upload and stock tracking.
- **Financial Analytics:** Detailed financial ledger with Recharts area and bar charts, date range filtering, Chapa reference search, and export options.
- **User Management & Moderation:** Account listing with verification status, role inspection, user banning/unbanning, and report tracking.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, React Router 7, Tailwind CSS v4, Radix UI, Lucide React, Recharts, Zustand |
| **Backend** | Node.js, Express.js 5, MongoDB, Mongoose 9, JWT, Bcrypt |
| **Cloud Services** | Cloudinary (Media storage), Chapa (Payment gateway), Google Gemini (RAG AI), Nodemailer / Gmail SMTP |
| **API Standards** | RESTful JSON API, OpenAPI 3.0 / Swagger UI (`/api-docs`) |

---

## 📁 Repository Structure

```
├── backend/                   # Express 5 REST API
│   ├── config/                # Database & Cloudinary configurations
│   ├── controllers/           # Business logic (admin, user, payments, rag)
│   ├── docs/                  # OpenAPI / Swagger specification
│   ├── middleware/            # JWT auth & centralized error handling
│   ├── models/                # Mongoose domain models
│   ├── routes/                # Express route endpoints
│   ├── scripts/               # Administrative seeding & utility scripts
│   └── server.js              # Server entry point
├── frontend/                  # React 19 SPA (Vite)
│   ├── public/                # Static assets, PWA manifest, service worker
│   ├── src/
│   │   ├── components/        # Reusable UI, admin controls, and AI curator
│   │   ├── hooks/             # Custom React hooks (debounced search, etc.)
│   │   ├── lib/               # API client with token auto-refresh
│   │   ├── pages/             # View routes (catalog, admin, community, auth)
│   │   └── store/             # Zustand global state stores
│   └── vite.config.js         # Vite configuration with chunk optimization
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection string)

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Configure Environment Variables

Create `.env` files in both `backend/` and `frontend/` using the provided templates:

**Backend (`backend/.env`):**
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SERVER_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/mesob_market

JWT_SECRET=your_super_secret_jwt_key_here
ACCESS_TOKEN_EXPIRES=15m

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

CHAPA_SECRET_KEY=CHASECK_TEST-your_chapa_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Install Dependencies & Run

**Backend:**
```bash
cd backend
npm install
npm run dev
# Server will run on http://localhost:3000
# Swagger documentation available at http://localhost:3000/api-docs
```

**Frontend (in a separate terminal):**
```bash
cd frontend
npm install
npm run dev
# Client will run on http://localhost:5173
```

---

## 🔌 API Endpoints Overview

The backend exposes an interactive Swagger documentation UI at `http://localhost:3000/api-docs`.

Key route groups:
- `/api/auth` — Customer authentication, registration, token refresh, and password recovery.
- `/api/products` — Product catalog browsing, filtering, search, and reviews.
- `/api/user/cart` — User shopping cart manipulation.
- `/api/user/orders` — Order creation and purchase history.
- `/api/pay` — Chapa payment initialization, verification, and webhooks.
- `/api/rag` — Conversational AI shopping assistant.
- `/api/community` — Community feed posts, reactions, comments, and reports.
- `/api/admin/*` — Administrative dashboards, order management, user access control, and financial analytics.

---

## 🧪 Automated Testing

Mesob Market includes comprehensive unit and integration test suites:

```bash
# Run all workspace test suites
npm test

# Run backend test suite (unit + integration)
npm run test:backend

# Run frontend test suite (state + calculations + components)
npm run test:frontend
```

---

## 🐳 Containerization & Docker Compose

Run the entire full-stack platform (MongoDB, Backend, Nginx Frontend) with one command:

```bash
# Production stack
docker compose up --build

# Development stack with live hot-reloading
docker compose -f docker-compose.dev.yml up --build
```

---

## 📚 Architecture & Documentation

- [Architecture Decision Records (ADRs)](docs/adr/)
- [Postman / Thunder Client API Collection](docs/mesob_market_postman_collection.json)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Changelog](CHANGELOG.md)

---

## 📜 Repository History & Provenance

> **Transparency Note:** The Git history of this repository was curated and reconstructed from a complete project source snapshot into structured milestone commits and feature branches (`develop`, `feature/*`, `main`). It reflects the platform's architectural layers, security hardening, service boundaries, automated test suites, containerization, and release workflow, rather than representing an original day-by-day development timeline.

---

## 👤 Author & Maintainer

- **Developer:** **Firomsa Girma Worku**
- **Student ID:** `CTC-2559-26`
- **Institution:** Adama Science and Technology University (ASTU)
- **Role:** Lead Developer, Architect, and Project Maintainer
- **Email:** [firomsagirma@astu.edu.et](mailto:firomsagirma@astu.edu.et)
- **GitHub:** [@fromsagirma](https://github.com/fromsagirma)

### Authorship & Implementation Statement
Mesob Market was designed, architected, and independently implemented by **Firomsa Girma Worku** as a full-stack e-commerce capstone application. The project encompasses full-stack system architecture, clean service boundaries, Ethiopian payment processing (Chapa), an AI shopping curator (Google Gemini RAG), comprehensive automated testing suites (122 tests), and containerized deployment workflows. Modern AI pair-programming tools (Google Antigravity / Gemini) were utilized for test suite expansion, static auditing, and documentation structuring.

---

## 🛡️ Security & Publishing Notes
- Sensitive credentials must strictly remain in `.env` and must never be committed to source control.
- Ensure production database connections enforce strict TLS certificate validation.
- Configure production CORS origins to restrict API access strictly to your deployed frontend domain.

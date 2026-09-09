# COOPNEX

> **National Cooperative Labour Digital Service Marketplace Platform**  
> Empowering Gig Artisans • Strengthening Cooperatives • Serving Citizens with Sovereign Public Infrastructure.

COOPNEX is a production-grade cooperative-owned service platform connecting verified skilled trade artisans (electricians, plumbers, carpenters, technicians, caregivers) with citizens and institutions across India. Unlike private gig platforms that extract high commissions without social security, COOPNEX guarantees 100% direct take-home pay, institutional welfare fund pooling, and transparent statutory governance under the Ministry of Cooperation mandate.

---

## Features

- **Customer Portal**:
  - Live verified artisan discovery with GPS geolocation & proximity sorting
  - 1-Click service booking & transparent statutory fair-wage tariff breakdown
  - Real-time in-app customer-worker messaging
  - Escrow payment protection with official GST-compliant downloadable receipt printing
  - 6-Digit completion OTP verification for secure worker disbursement
  - Profile, addresses, and history management

- **Worker Portal (Dual-Mode Responsive Workspace)**:
  - Adaptive dual-mode layout: comprehensive wide-table view for desktop and responsive high-density card workspace for mobile
  - Job lifecycle tracking (New Requests &rarr; Accepted &rarr; In Progress &rarr; Completed &rarr; History)
  - Citizen OTP entry modal with instant cryptographic validation
  - In-app communication with unclipped customer contacts, direct call triggers (`tel:`), and quick replies
  - Earnings & Wallet ledger with NPCI direct-to-bank settlement tracking
  - Cooperative Welfare Corpus management (PM-JAY health cover, tool equipment loans)
  - Printable official Sovereign Smart ID Card with QR authentication

- **Super Admin Portal & Governance Command Gateway**:
  - Centered institutional authentication flow with hardware 2FA / MFA challenge
  - **6 Statutory Governance Pillars Mandate**:
    1. Workforce Police Clearance & Skill Tier Certification (12,480 Artisans)
    2. Sub-7-Minute SOS Emergency Proximity GPS Vectoring (6.4 min arrival SLA)
    3. Financial Sovereignty & Direct Escrow Settlement (0% Platform Cut)
    4. Operational Oversight & Minimum Floor Wage Tariffs (100% Compliance)
    5. Trust & Defense Hardware Collision / Anti-Fraud Shield (0 Leaks)
    6. Democratic Labour Federation Leadership (42 Societies)
  - Interactive animated mission console with auto-cycling, progress indicator, and "View All 6" modal

- **Multilingual Support (13 Official Indian Languages)**:
  - Comprehensive, real-time localized dictionaries across all components:
    - English (`en`)
    - Hindi (`hi` - हिन्दी)
    - Telugu (`te` - తెలుగు)
    - Tamil (`ta` - தமிழ்)
    - Kannada (`kn` - ಕನ್ನಡ)
    - Malayalam (`ml` - മലയാളം)
    - Marathi (`mr` - मराठी)
    - Bengali (`bn` - বাংলা)
    - Gujarati (`gu` - ગુજરાતી)
    - Punjabi (`pa` - ਪੰਜਾਬੀ)
    - Odia (`or` - ଓଡ଼ିଆ)
    - Assamese (`as` - অসমীয়া)
    - Urdu (`ur` - اردو)
  - Universal search dropdown with native scripts and automatic `localStorage` persistence

- **Emergency Rapid Response**:
  - Sub-7-minute emergency dispatch network for critical electrical flashovers, gas line leaks, and plumbing hazards.

- **AI Demand Intelligence**:
  - Machine learning time-series demand forecasting and geospatial cluster heatmaps.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Canvas API, i18next
- **Backend**: Node.js, Express, TypeScript, JWT (with strict role isolation), Mongoose, Zod
- **Database**: MongoDB (Atlas-ready) with GeoJSON `2dsphere` spatial indexing
- **Authentication**: Multi-tier production security (Compound email/role indexing, BCrypt, TOTP MFA, 6-digit salted OTPs)
- **AI Microservice**: Python 3.11, FastAPI, scikit-learn (demand forecasting & load balancing)
- **Deployment**: Vercel (Frontend), Render / Railway (Backend API), MongoDB Atlas (Database)

---

## Project Structure

```
COOPNEX/
├── frontend/                     # React + TypeScript + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/           # UI Components (Portals, Cards, Modals)
│   │   │   ├── admin/            # Administrative Command components & 3D stages
│   │   │   ├── customer/         # Customer bookings, messages, payments views
│   │   │   ├── worker/           # Worker dual-mode jobs, messages, wallet, smart ID
│   │   │   └── layout/           # Unified Navbar, LanguageDropdown, Footers
│   │   ├── context/              # AuthContext, LanguageContext
│   │   ├── i18n/                 # 13 Official Indian Language locale catalogs
│   │   ├── pages/                # Admin, Customer, Worker, and Public pages
│   │   └── services/             # Centralized API service (VITE_API_URL ready)
│   └── vercel.json               # Vercel SPA routing & production configuration
│
├── backend/                      # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/               # Database connection (MongoDB Atlas ready)
│   │   ├── controllers/          # Auth, Admin, Worker, Booking, Payment controllers
│   │   ├── middleware/           # Strict JWT authentication & role-guard middleware
│   │   ├── models/               # User, Worker, Booking, Review, Audit Mongoose schemas
│   │   ├── routes/               # API endpoint routing (/api/...)
│   │   └── server.ts             # Dynamic CORS, port bridge, static fallback server
│   └── package.json
│
├── ai-service/                   # Python FastAPI AI forecasting service
├── .env.example                  # Environment variable blueprint (no secrets)
├── render.yaml                   # 1-Click Render cloud deployment blueprint
└── README.md
```

---

## Local Setup

### 1. Clone & Install Dependencies
```bash
# Clone repository
git clone https://github.com/SanthoshPyaram/COOPNEX.git
cd COOPNEX

# Install dependencies across all workspaces
npm run install:all
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in both `frontend` and `backend`:
```bash
# In backend
cp backend/.env.example backend/.env

# In frontend
cp frontend/.env.example frontend/.env
```
Fill in your own credentials (e.g. `MONGODB_URI`, `JWT_SECRET`, etc.). *Never commit `.env` files to git.*

### 3. Seed Local Database
```bash
npm run seed
```

### 4. Start Development Servers
Run the services in separate terminals:

```bash
# Terminal 1: Backend REST API (port 5000)
npm run start:backend

# Terminal 2: Frontend Client (port 3000)
npm run start:frontend

# (Optional) Terminal 3: AI Service (port 8000)
npm run start:ai
```

Open `http://localhost:3000` to launch the platform.

---

## Environment Variables

Developers must copy `.env.example` to `.env` and configure appropriate keys:

| Variable | Scope | Description |
|---|---|---|
| `MONGODB_URI` | Backend | MongoDB connection string (local or MongoDB Atlas) |
| `JWT_SECRET` | Backend | Cryptographic secret for signing session tokens |
| `OTP_SALT` | Backend | Salt for SHA-256 OTP hashing |
| `FRONTEND_URL` | Backend | Deployed frontend domain for production CORS |
| `VITE_API_URL` | Frontend | Target backend API URL (leave empty for Vite dev proxy) |
| `VITE_FIREBASE_*` | Frontend | Firebase configuration for cellular SMS OTP |
| `VITE_EMAILJS_*` | Frontend/Backend | EmailJS service and universal template IDs for email OTPs |

---

## Production Deployment

- **Frontend (Vercel)**:
  - Root directory: `frontend`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Configure `VITE_API_URL` in Vercel project environment variables.
- **Backend (Render / Railway)**:
  - Build command: `npm run install:all && npm run build`
  - Start command: `cd backend && npm start`
  - Configure `MONGODB_URI` (MongoDB Atlas), `JWT_SECRET`, and `FRONTEND_URL`.
- **Database (MongoDB Atlas)**:
  - Provide a secure, network-whitelisted `mongodb+srv://...` connection string.


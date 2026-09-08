# SAHAKARI SEVA (सहकारी सेवा / సహకారి సేవ)
## National Cooperative Labour Digital Service Marketplace Platform
### Smart India Hackathon (SIH) 2026 • Official Project Submission

> **"Empowering Workers. Strengthening Cooperatives. Serving Communities."**

---

### Executive Overview
**Sahakari Seva** is India's first cooperative-owned digital public infrastructure (DPI) connecting verified skilled trade workers (electricians, plumbers, carpenters, caregivers, technicians) with households and institutions.

Private gig platforms extract 25-35% commission while denying workers social security. In contrast, Sahakari Seva is **owned collectively by Labour Cooperative Federations and Societies**, guaranteeing:
- **Transparent Fair Wage Engine**: 82-85% direct worker take-home with transparent travel fuel allowances.
- **5-Tier Verified Workforce**: Aadhaar e-KYC, society registration, trade competency, and NSDC state council certification.
- **Explainable AI Matching**: Multi-criteria matching scoring proximity, skill tier, and anti-fatigue workload equity ("Why This Worker?").
- **🚨 7-Minute Emergency Response**: Rapid geo-dispatch for hazardous electrical and plumbing emergencies.
- **Cooperative Workforce Exchange**: Inter-society surplus-deficit load balancing deploying idle workers across districts.
- **Worker Welfare & Insurance**: Embedded PMSBY and PM-JAY medical coverage (₹5 Lakh), toolkit grants, and education scholarships.

---

### Primary Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Recharts, Leaflet / OpenStreetMap
- **Backend API**: Node.js, Express, TypeScript, JWT Authentication, Strict Role-Based Access Control (RBAC), Zod
- **Database**: MongoDB v8.3.4 (MongoDB Atlas compatible) with GeoJSON `2dsphere` spatial indexing
- **Artificial Intelligence**: Python 3.11, FastAPI, scikit-learn (GradientBoosting time-series demand forecasting, statistical anomaly surge detector, bipartite allocation optimizer)
- **Payments**: Test/Sandbox Escrow Gateway with instant wallet disbursement and GST-compliant invoices

---

### Quick Start Instructions

#### 1. Install Dependencies
```bash
# Install backend and frontend packages
npm run install:all
```

#### 2. Seed Database
```bash
npm run seed
```
*(Populates realistic Indian cooperative datasets, 5 persona demo accounts, and Level 4 certified worker profiles across Vijayawada and Guntur).*

#### 3. Start Application
Run the microservices across 3 terminals:
- **Terminal 1 (AI Microservice)**:
  ```bash
  npm run start:ai
  ```
  *(Runs on `http://localhost:8000`)*

- **Terminal 2 (Backend REST API)**:
  ```bash
  npm run start:backend
  ```
  *(Runs on `http://localhost:5000`)*

- **Terminal 3 (Vite React Frontend)**:
  ```bash
  npm run start:frontend
  ```
  *(Runs on `http://localhost:3000`)*

---

### Winning SIH Demonstration Journey
Visit `http://localhost:3000/demo` to launch the 1-click interactive walkthrough of the exact winning storyline:
1. Citizen triggers midnight electrical emergency in Vijayawada
2. AI ranks Raj Kumar (Level 4 State Certified) with 96% match score
3. Citizen confirms; worker navigates and arrives on-site
4. Work completed; transparent Fair Wage Engine calculates worker earnings (₹650) vs Co-op Welfare Fund (₹78)
5. Citizen submits 5★ rating; wallet credited instantly
6. State Federation Command Center detects +29% electrician surge for tomorrow
7. Federation Admin executes Cooperative Workforce Exchange (transferring 6 surplus plumbers from Guntur East to Vijayawada Central).

---

### Pre-Seeded Demo Accounts (Password: `DemoPassword123!`)
Switch between personas with 1 click in the top demo header:
- **Customer**: `customer@sahakariseva.gov.in`
- **Worker (Raj Kumar)**: `worker.raj@sahakariseva.gov.in`
- **Society Admin**: `society.admin@sahakariseva.gov.in`
- **Federation Admin**: `federation.admin@sahakariseva.gov.in`
- **Super Admin**: `super.admin@sahakariseva.gov.in`

---

### Documentation Links
- [System Architecture](docs/ARCHITECTURE.md)
- [Database Schema & Indexes](docs/DATABASE.md)
- [REST API Specifications](docs/API.md)
- [AI & ML Forecaster](docs/AI.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Judge Demo Guide](docs/DEMO.md)


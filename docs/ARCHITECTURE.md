# Technical Architecture Document
## Sahakari Seva - Cooperative Labour Digital Service Marketplace Platform (SIH 2026)

### 1. Architectural Philosophy
Sahakari Seva is engineered as a **Digital Public Infrastructure (DPI)** designed specifically for Labour Cooperative Federations and Societies. Unlike private commercial aggregators that treat workers as replaceable gig contractors and extract 25-35% predatory commissions, Sahakari Seva places **cooperative ownership, worker welfare, and fair wage mathematics** at the center of the system architecture.

### 2. High-Level System Architecture
```
                                 [ CITIZEN / CUSTOMER ]
                                           │
                                           ▼
                 ┌──────────────────────────────────────────────────┐
                 │       CLIENT LAYER (React 18 + TypeScript)       │
                 │  • Customer Progressive Web App                  │
                 │  • Worker Mobile Dashboard                       │
                 │  • Society Admin Portal                          │
                 │  • Federation Command Center                     │
                 └─────────────────────────┬────────────────────────┘
                                           │ HTTPS / REST (JSON)
                                           ▼
                 ┌──────────────────────────────────────────────────┐
                 │        API GATEWAY & CORE BACKEND (Node.js)      │
                 │  • Express Router & Request Sanitization         │
                 │  • JWT Authentication & Strict RBAC              │
                 │  • Geospatial Routing Service (Haversine/ETA)    │
                 │  • Fair Wage Calculation Engine                  │
                 │  • Payment & Escrow Settlement Coordinator       │
                 └──────────────┬─────────────────────────┬─────────┘
                                │                         │
             MongoDB Driver / Mongoose            HTTP Microservice API
                                │                         │
                                ▼                         ▼
                 ┌───────────────────────────┐   ┌──────────────────────────┐
                 │       DATABASE LAYER      │   │     AI & ML SERVICE      │
                 │     (MongoDB Atlas)       │   │     (Python FastAPI)     │
                 │ • GeoJSON 2dsphere Index  │   │ • Scikit-Learn Forecaster│
                 │ • Users, Workers, Bookings│   │ • Multi-Criteria Matching│
                 │ • Audited Ledger & Welfare│   │ • Workforce Exchange Opt │
                 └───────────────────────────┘   │ • Demand Surge Anomaly   │
                                                 └──────────────────────────┘
```

### 3. Component Details
1. **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS + Lucide React + Recharts + Leaflet. Provides responsive mobile-first citizen flows and desktop command centers for federation administrators.
2. **Backend**: Node.js + Express + TypeScript. Stateless, modular service layer enforcing strict Role-Based Access Control (`CUSTOMER`, `WORKER`, `SOCIETY_ADMIN`, `FEDERATION_ADMIN`, `SUPER_ADMIN`).
3. **Database**: MongoDB v8.3.4 with 2dsphere spatial indexing for sub-millisecond hyper-local worker proximity lookups.
4. **AI Microservice**: Python 3.11 with FastAPI and scikit-learn. Trains on 180-day cooperative booking distributions to forecast demand, calculate 5-factor worker match scores, detect demand anomalies (+144%), and solve cross-society surplus-deficit load balancing.


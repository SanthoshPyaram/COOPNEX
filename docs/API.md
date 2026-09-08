# REST API Documentation
## Sahakari Seva (SIH 2026)

Base URL: `http://localhost:5000/api`

### 1. Authentication
- `POST /api/auth/register` - Create customer or worker account
- `POST /api/auth/login` - Authenticate and receive JWT token
- `POST /api/auth/demo-login` - Instant 1-click persona switch (CUSTOMER, WORKER, SOCIETY_ADMIN, FEDERATION_ADMIN, SUPER_ADMIN)
- `GET /api/auth/me` - Get current session user profile

### 2. Workers & Geospatial Search
- `GET /api/workers` - Query workers with filters (`skill`, `district`, `minRating`, `verificationLevel`)
- `GET /api/workers/nearby` - Hyper-local 2dsphere proximity search with AI match ranking
- `GET /api/workers/:id` - Full worker profile with verification history and credentials
- `PATCH /api/workers/:workerId/verify` - Society/Federation Admin verification status elevation

### 3. Bookings & Emergency Dispatch
- `POST /api/bookings` - Standard booking initiation
- `GET /api/bookings/my` - Customer or worker's active/past bookings
- `PATCH /api/bookings/:id/status` - Transition booking lifecycle status (`ACCEPTED`, `ON_THE_WAY`, `ARRIVED`, `COMPLETED`)
- `POST /api/emergency` - 🚨 1-Click Priority Emergency Electrical/Plumbing Dispatch
- `GET /api/emergency/:id/track` - Real-time transit coordinates and status timeline

### 4. Fair Wage Engine
- `POST /api/fair-wage/calculate` - Real-time itemized price breakdown calculation
- `GET /api/fair-wage/policy` - Inspect configurable cooperative wage policy rules

### 5. Payments & Invoices
- `POST /api/payments/create-order` - Generate test payment order
- `POST /api/payments/verify` - Settle payment, credit worker wallet, credit cooperative fund
- `GET /api/invoices/:bookingId` - Fetch official GST-compliant cooperative invoice

### 6. Cooperative Command Center & Analytics
- `GET /api/admin/intelligence` - Federation KPIs, utilization index, and active alerts
- `GET /api/admin/heatmap` - GIS demand zones (Low, Medium, High, Critical)
- `GET /api/admin/workforce-exchanges` - Active cross-society surplus/deficit recommendations
- `POST /api/admin/workforce-exchanges/:exchangeId/approve` - Approve cross-society deployment


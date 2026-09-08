# Deployment Guide
## Sahakari Seva (SIH 2026)

### Prerequisites
- Node.js v18+ (tested on v20.20.0)
- Python 3.10+ (tested on v3.11.9)
- MongoDB v6+ (tested on v8.3.4 local / MongoDB Atlas)

### Local Development Setup
1. **Clone and Install**:
   ```bash
   cd "SMART INDIA HACKATHON"
   npm run install:all
   ```

2. **Seed Database**:
   ```bash
   npm run seed
   ```

3. **Start Microservices**:
   - Terminal 1 (Python AI Microservice):
     ```bash
     npm run start:ai
     ```
     (Runs FastAPI on `http://localhost:8000`)
   - Terminal 2 (Node.js Backend):
     ```bash
     npm run start:backend
     ```
     (Runs Express API on `http://localhost:5000`)
   - Terminal 3 (Vite React Frontend):
     ```bash
     npm run start:frontend
     ```
     (Runs Web App on `http://localhost:3000`)

### Production Cloud Deployment
- **Frontend**: Deploy `frontend/dist` to Vercel, Netlify, or AWS S3/CloudFront.
- **Backend**: Deploy `backend/dist` to AWS ECS, Google Cloud Run, or DigitalOcean App Platform.
- **Database**: MongoDB Atlas Cluster with M0/M10 tier, configuring `MONGODB_URI`.
- **AI Microservice**: Deploy `ai-service/` container with Uvicorn on Cloud Run or Render.


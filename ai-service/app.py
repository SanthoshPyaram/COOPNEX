"""
Sahakari Seva - Python AI Microservice (FastAPI)
Provides Demand Forecasting, Multi-Criteria Worker Matching, Future Skill-Gap Analysis,
Cooperative Workforce Exchange, and Demand Surge Detection.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uvicorn
import os

from demand_forecaster import forecaster
from match_engine import match_engine
from skill_gap import skill_gap_analyzer
from workforce_exchange import exchange_engine
from surge_detector import surge_detector

app = FastAPI(
    title="Sahakari Seva AI Microservice",
    description="Machine Learning and Workforce Optimization Engine for Labour Cooperative Federations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Request Models
class ForecastRequest(BaseModel):
    service: str = "Electrician"
    location: str = "Vijayawada"
    days_ahead: int = 7
    current_capacity: Optional[int] = None

class MatchWorkerRequest(BaseModel):
    required_service: str = "Electrician"
    customer_latitude: float = 16.5062
    customer_longitude: float = 80.6480
    is_emergency: bool = False
    workers: List[Dict[str, Any]] = []

class SkillGapRequest(BaseModel):
    district: str = "Vijayawada"
    days_window: int = 7

class SurgeRequest(BaseModel):
    service: str = "Electrician"
    zone: str = "Vijayawada Sector 4"

@app.get("/")
def index():
    return {
        "service": "Sahakari Seva AI Microservice",
        "status": "OPERATIONAL",
        "version": "1.0.0",
        "endpoints": [
            "/api/ai/forecast",
            "/api/ai/match",
            "/api/ai/skill-gap",
            "/api/ai/workforce-exchange",
            "/api/ai/surge-detect"
        ]
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "sahakari-ai"}

@app.post("/api/ai/forecast")
def get_forecast(req: ForecastRequest):
    try:
        res = forecaster.forecast_service(
            service=req.service,
            location=req.location,
            days_ahead=req.days_ahead,
            current_capacity=req.current_capacity
        )
        return {"success": True, "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/match")
def rank_workers(req: MatchWorkerRequest):
    try:
        ranked = match_engine.rank_workers(
            workers=req.workers,
            required_service=req.required_service,
            cust_lat=req.customer_latitude,
            cust_lon=req.customer_longitude,
            is_emergency=req.is_emergency
        )
        return {
            "success": True,
            "required_service": req.required_service,
            "is_emergency": req.is_emergency,
            "matched_worker_count": len(ranked),
            "top_match": ranked[0] if ranked else None,
            "ranked_workers": ranked
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/skill-gap")
def analyze_skill_gap(req: SkillGapRequest):
    try:
        res = skill_gap_analyzer.analyze_district(
            district=req.district,
            days_window=req.days_window
        )
        return {"success": True, "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/workforce-exchange")
@app.post("/api/ai/workforce-exchange")
def get_workforce_exchange():
    try:
        recs = exchange_engine.get_exchange_recommendations()
        return {"success": True, "recommendations": recs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/surge-detect")
@app.post("/api/ai/surge-detect")
def detect_demand_surge(service: str = "Electrician", zone: str = "Vijayawada Sector 4"):
    try:
        surge_info = surge_detector.detect_surges(service=service, zone=zone)
        return {"success": True, "data": surge_info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("AI_PORT", 8000))
    print(f"Starting Sahakari Seva AI Microservice on port {port}...")
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)


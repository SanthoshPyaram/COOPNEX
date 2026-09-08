"""
Sahakari Seva - Intelligent Worker Matching Engine & AI Explainability
Calculates multi-objective normalized match scores (0-100%) and transparent "Why This Worker?" rationale.
"""

import math
from typing import List, Dict, Any

class WorkerMatchEngine:
    """
    Evaluates candidate workers against job requirements using a transparent,
    fair-weighted multi-objective algorithm.
    Weights:
      - Skill & Certification Match: 30%
      - Distance & Response ETA: 25%
      - Verification Level (Tier 1-5): 15%
      - Customer Rating & Experience: 15%
      - Workload Fairness Penalty: 15%
    """
    def __init__(self):
        self.weights = {
            "skill": 0.30,
            "distance": 0.25,
            "verification": 0.15,
            "rating_exp": 0.15,
            "workload_fairness": 0.15
        }

    def calculate_distance_km(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Haversine distance formula."""
        R = 6371.0 # Earth radius in km
        dLat = math.radians(lat2 - lat1)
        dLon = math.radians(lon2 - lon1)
        a = (math.sin(dLat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(dLon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    def calculate_eta_minutes(self, distance_km: float, is_emergency: bool = False) -> int:
        """Urban transit speed estimation with cooperative quick dispatch."""
        avg_speed_kmh = 22.0 if is_emergency else 18.0
        dispatch_delay = 2 if is_emergency else 5
        travel_minutes = (distance_km / avg_speed_kmh) * 60
        return max(5, int(round(travel_minutes + dispatch_delay)))

    def evaluate_worker(
        self,
        worker: Dict[str, Any],
        required_service: str,
        cust_lat: float,
        cust_lon: float,
        is_emergency: bool = False
    ) -> Dict[str, Any]:
        """Calculates normalized match score and human-readable explanation tags."""
        # 1. Skill Score
        skills = worker.get("skills", [])
        exact_match = any(required_service.lower() in s.lower() for s in skills)
        skill_score = 1.0 if exact_match else 0.4

        # 2. Verification Level Score (Level 1 to 5)
        # Level 1: Identity, 2: Cooperative, 3: Skill, 4: Certificate, 5: Master Experience
        v_level = worker.get("verificationLevel", 3)
        v_score = min(1.0, max(0.2, v_level / 5.0))

        # 3. Distance & ETA Score (Decay function over 15km)
        w_loc = worker.get("location", {}).get("coordinates", [0.0, 0.0])
        # GeoJSON is [longitude, latitude]
        w_lon, w_lat = w_loc[0], w_loc[1]
        distance_km = self.calculate_distance_km(cust_lat, cust_lon, w_lat, w_lon)
        # 0 km = 1.0, 10 km = 0.5, >15 km = near 0
        dist_score = max(0.05, 1.0 - (distance_km / 15.0))
        eta_min = self.calculate_eta_minutes(distance_km, is_emergency)

        # 4. Rating & Experience Score
        rating = float(worker.get("rating", 4.5))
        norm_rating = min(1.0, rating / 5.0)
        exp_years = min(15, worker.get("experienceYears", 3))
        norm_exp = exp_years / 15.0
        rating_exp_score = (norm_rating * 0.7) + (norm_exp * 0.3)

        # 5. Workload Fairness (Equitable job distribution among cooperative workers)
        active_jobs = worker.get("activeJobsToday", 0)
        # 0 jobs = 1.0, 1 job = 0.85, 2 jobs = 0.70, 3+ jobs = 0.40
        if active_jobs == 0:
            fairness_score = 1.0
        elif active_jobs == 1:
            fairness_score = 0.85
        elif active_jobs == 2:
            fairness_score = 0.70
        else:
            fairness_score = 0.45

        # Weighted Aggregate Score
        composite = (
            (skill_score * self.weights["skill"]) +
            (dist_score * self.weights["distance"]) +
            (v_score * self.weights["verification"]) +
            (rating_exp_score * self.weights["rating_exp"]) +
            (fairness_score * self.weights["workload_fairness"])
        )

        # Emergency priority bonus
        if is_emergency and worker.get("emergencyReady", False):
            composite = min(1.0, composite + 0.05)

        match_score_pct = int(round(composite * 100))

        # Generate Explainability Badges & "Why This Worker?" rationale
        reasons = []
        if exact_match:
            reasons.append(f"✓ {required_service} Certified")
        if v_level >= 4:
            reasons.append(f"✓ Level {v_level} Cooperative Verified")
        elif v_level >= 2:
            reasons.append("✓ Verified Cooperative Member")

        if distance_km <= 2.5:
            reasons.append(f"✓ Hyper-local ({distance_km} km away, ETA {eta_min}m)")
        else:
            reasons.append(f"✓ Within service radius ({distance_km} km)")

        if rating >= 4.8:
            reasons.append(f"✓ Exceptional rating ({rating}★)")
        elif rating >= 4.5:
            reasons.append(f"✓ High customer satisfaction ({rating}★)")

        if fairness_score >= 0.85:
            reasons.append("✓ Available immediately (low active workload)")

        if is_emergency and worker.get("emergencyReady", False):
            reasons.append("🚨 Priority Emergency Response Certified")

        return {
            "worker_id": str(worker.get("_id", worker.get("id", ""))),
            "worker_name": worker.get("name", "Verified Worker"),
            "avatar": worker.get("avatar", ""),
            "society_name": worker.get("societyName", "Central Labour Cooperative"),
            "match_score": match_score_pct,
            "distance_km": distance_km,
            "eta_minutes": eta_min,
            "verification_level": v_level,
            "rating": rating,
            "review_count": worker.get("reviewCount", 42),
            "experience_years": worker.get("experienceYears", 4),
            "hourly_rate": worker.get("hourlyRate", 350),
            "reasons": reasons,
            "breakdown": {
                "skill_fit": round(skill_score * 100, 1),
                "distance_proximity": round(dist_score * 100, 1),
                "verification_level": round(v_score * 100, 1),
                "reputation_experience": round(rating_exp_score * 100, 1),
                "workload_equity": round(fairness_score * 100, 1)
            }
        }

    def rank_workers(
        self,
        workers: List[Dict[str, Any]],
        required_service: str,
        cust_lat: float,
        cust_lon: float,
        is_emergency: bool = False
    ) -> List[Dict[str, Any]]:
        """Ranks a list of candidate workers and returns sorted list with match metrics."""
        scored = [
            self.evaluate_worker(w, required_service, cust_lat, cust_lon, is_emergency)
            for w in workers
        ]
        # Sort descending by match_score, then ascending by distance_km
        scored.sort(key=lambda x: (-x["match_score"], x["distance_km"]))
        return scored

match_engine = WorkerMatchEngine()


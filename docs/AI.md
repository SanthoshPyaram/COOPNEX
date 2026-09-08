# Artificial Intelligence & Machine Learning Architecture
## Sahakari Seva (SIH 2026)

The AI subsystem operates as an independent Python FastAPI microservice (`ai-service/`, port 8000) using **scikit-learn, pandas, and numpy**.

### 1. AI Modules
1. **Demand Forecaster (`demand_forecaster.py`)**:
   - Algorithm: `GradientBoostingRegressor(n_estimators=70, max_depth=4, learning_rate=0.08)`.
   - Features: `day_of_week`, `is_weekend`, `month`, `day_of_month`, `seasonal_factor`, and one-hot encoded `service`.
   - Outputs: 7-day projected request volume, 95% confidence bounds, and explainability factors (e.g. weekend household repair surge, monsoon plumbing cycle).

2. **Multi-Criteria Worker Matching Engine (`match_engine.py`)**:
   - Normalized Score (0 - 100%):
     $$\text{Score} = (0.30 \cdot \text{Skill}) + (0.25 \cdot \text{Distance}) + (0.15 \cdot \text{Verification}) + (0.15 \cdot \text{Rating/Exp}) + (0.15 \cdot \text{Workload Equity})$$
   - Generates transparent "Why This Worker?" rationale tags.
   - Prevents worker fatigue by penalizing back-to-back assignments to ensure equitable income distribution among cooperative members.

3. **Future Skill-Gap Analyzer (`skill_gap.py`)**:
   - Compares 7 to 30 day demand volume against active registered cooperative rosters per trade.
   - Formulates targeted upskilling recommendations (e.g. fast-track Level 4 solar safety certification).

4. **Cooperative Workforce Exchange Solver (`workforce_exchange.py`)**:
   - Bipartite surplus-to-deficit solver detecting labor imbalances between neighboring societies.
   - Calculates optimal worker transfers with fair daily travel stipends.

5. **Demand Surge Detector (`surge_detector.py`)**:
   - Statistical anomaly detector triggering when daily request rate exceeds historical baseline by $>50\%$ (z-score $>2.0$).


# Database Schema & MongoDB Specification
## Sahakari Seva (SIH 2026)

### 1. Database Engine
- **Engine**: MongoDB (Native MongoDB v8.3.4 / MongoDB Atlas)
- **Geospatial Model**: GeoJSON Point (`coordinates: [longitude, latitude]`)
- **Index Type**: `2dsphere` spatial index for spherical trigonometry queries (`$near`, `$geoWithin`)

### 2. Core Collections
1. `users`:
   - `_id`, `name`, `email` (indexed), `phone` (indexed), `passwordHash`, `role` (`CUSTOMER`, `WORKER`, `SOCIETY_ADMIN`, `FEDERATION_ADMIN`, `SUPER_ADMIN`), `district`, `societyId`, `federationId`.
2. `workers`:
   - `_id`, `userId` (ref User), `workerIdNumber` (e.g. `SS-AP-2026-104`), `name`, `phone`, `avatarUrl`, `societyId` (ref Society), `location` (`{ type: "Point", coordinates: [lon, lat] }` with **2dsphere index**), `serviceRadiusKm`, `skills` (indexed array), `experienceYears`, `verificationLevel` (1 to 5), `verificationStatus`, `verificationTimeline`, `certificates`, `rating`, `reviewCount`, `jobsCompletedCount`, `isAvailable`, `emergencyReady`, `walletBalance`, `insuranceInfo`.
3. `federations` & `societies`:
   - Federation-Society hierarchy with office locations, welfare reserve funds, and registration numbers.
4. `bookings`:
   - `_id`, `bookingNumber`, `customerId`, `workerId`, `serviceCategory`, `serviceLocation` (GeoJSON with 2dsphere index), `bookingType` (`STANDARD` / `EMERGENCY`), `status` (`REQUESTED`, `MATCHING`, `ASSIGNED`, `ACCEPTED`, `ON_THE_WAY`, `ARRIVED`, `IN_PROGRESS`, `COMPLETED`), `statusTimeline`, `aiMatchScore`, `fairWageBreakdown`, `paymentStatus`.
5. `payments` & `invoices`:
   - Test transactions, itemized breakdown (Base, Skill, Experience, Travel, Emergency, Take-home, Cooperative contribution, GST).
6. `workforceExchanges`:
   - Cross-society surplus-deficit deployment records with audit history.
7. `welfare` & `insurance`:
   - Active social protection schemes, PMSBY policy records, and claims.


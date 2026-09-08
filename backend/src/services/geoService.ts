export class GeoService {
  public static calculateDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
  }

  public static calculateEtaMinutes(distanceKm: number, isEmergency: boolean = false): number {
    const speedKmh = isEmergency ? 24 : 18; // urban traffic
    const dispatchPrepTime = isEmergency ? 2 : 5;
    const transitMinutes = (distanceKm / speedKmh) * 60;
    return Math.max(4, Math.round(transitMinutes + dispatchPrepTime));
  }

  public static toGeoJsonPoint(longitude: number, latitude: number) {
    return {
      type: "Point",
      coordinates: [longitude, latitude] as [number, number]
    };
  }
}


export type GasStation = {
    id: number;
    lat: number;
    lon: number;
    name?: string;
    distance?: number; // 米
};

export async function fetchGasStations(lat: number, lon: number, radiusMeters: number = 5000): Promise<GasStation[]> {
    const query = `
    [out:json][timeout:25];
    (
      node["amenity"="fuel"](around:${radiusMeters},${lat},${lon});
      way["amenity"="fuel"](around:${radiusMeters},${lat},${lon});
      relation["amenity"="fuel"](around:${radiusMeters},${lat},${lon});
    );
    out center;
  `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Overpass API error');
        const data = await res.json();

        return data.elements.map((el: any) => ({
            id: el.id,
            lat: el.lat || el.center.lat,
            lon: el.lon || el.center.lon,
            name: el.tags?.name || 'Unknown Station',
            // 稍后计算距离或使用 Turf.js。目前使用简单的哈弗辛公式？
        }));
    } catch (e) {
        console.error(e);
        return [];
    }
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // 米
    const φ1 = lat1 * Math.PI / 180; // φ, λ 为弧度
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 单位：米
}

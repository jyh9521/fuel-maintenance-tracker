"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchGasStations, calculateDistance, GasStation } from '@/lib/map';
import { useI18n } from '@/lib/i18n';

// 修复 Leaflet 默认图标路径问题
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function LeafletMap({ onSelect }: { onSelect?: (stationName: string) => void }) {
    const { t } = useI18n();
    const [location, setLocation] = useState<{ lat: number, lon: number } | null>(null);
    const [stations, setStations] = useState<GasStation[]>([]);
    const [loading, setLoading] = useState(false);
    const [permissionError, setPermissionError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                },
                () => setPermissionError(true)
            );
        } else {
            setPermissionError(true);
        }
    }, []);

    useEffect(() => {
        if (location) {
            setLoading(true);
            fetchGasStations(location.lat, location.lon)
                .then((data) => {
                    const withDist = data.map(s => ({
                        ...s,
                        distance: calculateDistance(location.lat, location.lon, s.lat, s.lon)
                    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
                    setStations(withDist.slice(0, 20));
                })
                .finally(() => setLoading(false));
        }
    }, [location]);

    const handleSelect = (name: string) => {
        if (onSelect) onSelect(name);
    };

    const filteredStations = stations.filter(s =>
        (s.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (permissionError) {
        return <div className="p-4 text-center text-red-400">{t('map.permission_error')}</div>;
    }

    if (!location) {
        return <div className="p-4 text-center animate-pulse">{t('map.locating')}</div>;
    }

    return (
        <div className="space-y-4">
            <div className="h-[400px] rounded-lg overflow-hidden border border-white/10 relative z-0">
                <MapContainer center={[location.lat, location.lon]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={[location.lat, location.lon]}>
                        <Popup>You are here</Popup>
                    </Marker>
                    <Circle center={[location.lat, location.lon]} radius={5000} pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} />

                    {filteredStations.map(station => (
                        <Marker key={station.id} position={[station.lat, station.lon]}>
                            <Popup>
                                <b>{station.name}</b><br />
                                {Math.round(station.distance!)} m away<br />
                                {onSelect && (
                                    <button
                                        className="mt-2 bg-blue-600 text-white px-2 py-1 rounded text-xs"
                                        onClick={() => handleSelect(station.name || 'Unknown Station')}
                                    >
                                        Select
                                    </button>
                                )}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold mb-2">{t('map.nearby')}</h3>
                <input
                    type="text"
                    placeholder="Search station..."
                    className="input mb-2 text-sm py-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {loading && <div className="text-sm text-muted">{t('common.loading')}</div>}
                <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {filteredStations.map(station => (
                        <div
                            key={station.id}
                            className={`flex justify-between items-center text-sm p-2 hover:bg-white/5 rounded border-b border-white/5 ${onSelect ? 'cursor-pointer active:bg-white/10' : ''}`}
                            onClick={() => onSelect && handleSelect(station.name || 'Unknown Station')}
                        >
                            <span className="truncate max-w-[70%]">{station.name}</span>
                            <span className="font-mono text-accent">{Math.round(station.distance!)}m</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

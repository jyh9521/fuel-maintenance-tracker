"use client";

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
    ssr: false,
    loading: () => <div className="h-[400px] bg-white/5 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
});

export function GasStationMap({ onSelect }: { onSelect?: (stationName: string) => void }) {
    return <LeafletMap onSelect={onSelect} />;
}

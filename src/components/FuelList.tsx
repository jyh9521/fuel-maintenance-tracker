"use client";

import React, { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';

type FuelRecord = {
    id: string;
    mileage: number;
    liters: number;
    price: number;
    fullTank: boolean;
    date: string; // 从 API 序列化
};

export function FuelList({ vehicleId, refreshTrigger }: { vehicleId: string, refreshTrigger: number }) {
    const { t } = useI18n();
    const [records, setRecords] = useState<FuelRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/fuel?vehicleId=${vehicleId}`);
                if (res.ok) {
                    const data = await res.json();
                    setRecords(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, [vehicleId, refreshTrigger]);

    if (loading) return <div className="text-muted text-sm">{t('common.loading')}</div>;
    if (records.length === 0) return <div className="text-muted text-sm">{t('fuel.no_records')}</div>;

    return (
        <div className="space-y-4">
            {records.map((record) => (
                <div key={record.id} className="flex justify-between items-center bg-white/5 p-3 rounded">
                    <div>
                        <div className="text-sm font-bold">{new Date(record.date).toLocaleDateString()}</div>
                        <div className="text-xs text-muted">{record.fullTank ? t('fuel.full_tank') : ''}</div>
                    </div>
                    <div className="text-right">
                        <div className="font-mono">{record.liters.toFixed(2)} L</div>
                        <div className="text-xs text-muted font-mono">{record.mileage} km</div>
                    </div>
                    <div className="font-mono font-bold text-accent">
                        ¥{record.price.toFixed(2)}
                    </div>
                </div>
            ))}
        </div>
    );
}

"use client";

import React, { useEffect, useState } from 'react';
import { Card } from './ui/Card';
import { calculateConsumption, FuelRecord } from '@/lib/fuel';
import { useI18n } from '@/lib/i18n';

export function FuelStats({ vehicleId, refreshTrigger }: { vehicleId: string, refreshTrigger: number }) {
    const { t } = useI18n();
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await fetch(`/api/fuel?vehicleId=${vehicleId}`);
                if (res.ok) {
                    const data: FuelRecord[] = await res.json();
                    // 解析日期
                    const parsed = data.map(d => ({ ...d, date: new Date(d.date) }));
                    const s = calculateConsumption(parsed);
                    setStats(s);
                }
            } catch (e) {
                console.error(e);
            }
        };
        loadStats();
    }, [vehicleId, refreshTrigger]);

    if (!stats) return <div className="animate-pulse h-20 bg-white/5 rounded"></div>;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="flex flex-col justify-center items-center py-4">
                <div className="text-xs text-muted uppercase">{t('fuel.stats.avg')}</div>
                <div className="text-2xl font-bold text-primary">
                    {stats.averageConsumption} <span className="text-xs text-muted">L/100km</span>
                </div>
            </Card>
            <Card className="flex flex-col justify-center items-center py-4">
                <div className="text-xs text-muted uppercase">{t('fuel.stats.last')}</div>
                <div className="text-2xl font-bold text-blue-300">
                    {stats.lastConsumption || '-'} <span className="text-xs text-muted">L/100km</span>
                </div>
            </Card>
            <Card className="flex flex-col justify-center items-center py-4">
                <div className="text-xs text-muted uppercase">{t('fuel.stats.total_dist')}</div>
                <div className="text-2xl font-bold">
                    {stats.totalDistance} <span className="text-xs text-muted">km</span>
                </div>
            </Card>
            <Card className="flex flex-col justify-center items-center py-4">
                <div className="text-xs text-muted uppercase">{t('fuel.stats.cost_km')}</div>
                <div className="text-2xl font-bold text-accent">
                    ¥{stats.averageCostPerKm}
                </div>
            </Card>
        </div>
    );
}

"use client";

import React, { useEffect, useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { predictMaintenance, calculateDailyAverage, MaintenanceConfig } from '@/lib/maintenance';
import { useI18n } from '@/lib/i18n';

type MaintenanceCardProps = {
    vehicle: any; // 原型阶段暂时用 any
    refreshTrigger: number;
};

export function MaintenanceCard({ vehicle, refreshTrigger }: MaintenanceCardProps) {
    const { t } = useI18n();
    const [config, setConfig] = useState<MaintenanceConfig | null>(vehicle.maintenanceConfig || null);
    const [prediction, setPrediction] = useState<any>(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // 编辑状态
    const [editForm, setEditForm] = useState({
        intervalKm: 5000,
        lastServiceKm: 0,
        lastServiceDate: '',
    });

    useEffect(() => {
        if (vehicle.maintenanceConfig) {
            setConfig(vehicle.maintenanceConfig);
            setEditForm({
                intervalKm: vehicle.maintenanceConfig.intervalKm,
                lastServiceKm: vehicle.maintenanceConfig.lastServiceKm,
                lastServiceDate: new Date(vehicle.maintenanceConfig.lastServiceDate).toISOString().split('T')[0]
            });
        }
    }, [vehicle]);

    useEffect(() => {
        // 获取加油记录来计算日均里程
        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/fuel?vehicleId=${vehicle.id}`);
                if (res.ok) {
                    const records = await res.json();
                    const parsed = records.map((r: any) => ({ ...r, date: new Date(r.date) }));
                    const avg = calculateDailyAverage(parsed);

                    if (config) {
                        const pred = predictMaintenance(vehicle.odometer, {
                            ...config,
                            lastServiceDate: new Date(config.lastServiceDate)
                        }, avg || 30); // 如果没有数据默认日均 30km
                        setPrediction(pred);
                    }
                }
            } catch (e) { console.error(e); }
        };
        if (config) fetchStats();
    }, [vehicle, config, refreshTrigger]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/vehicles/${vehicle.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    maintenanceConfig: {
                        intervalKm: parseInt(editForm.intervalKm as any),
                        lastServiceKm: parseInt(editForm.lastServiceKm as any),
                        lastServiceDate: editForm.lastServiceDate
                    }
                })
            });
            if (res.ok) {
                const updated = await res.json();
                setConfig(updated.maintenanceConfig);
                setEditing(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!config) return null;

    if (editing) {
        return (
            <Card className="mb-6 border-yellow-500/20">
                <h3 className="text-lg font-bold mb-4">{t('maintenance.settings')}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-muted mb-1">{t('maintenance.settings.interval')}</label>
                        <input className="input" type="number" value={editForm.intervalKm} onChange={e => setEditForm({ ...editForm, intervalKm: e.target.value as any })} />
                    </div>
                    <div>
                        <label className="block text-sm text-muted mb-1">{t('maintenance.settings.last_km')}</label>
                        <input className="input" type="number" value={editForm.lastServiceKm} onChange={e => setEditForm({ ...editForm, lastServiceKm: e.target.value as any })} />
                    </div>
                    <div>
                        <label className="block text-sm text-muted mb-1">{t('maintenance.settings.last_date')}</label>
                        <input className="input" type="date" value={editForm.lastServiceDate} onChange={e => setEditForm({ ...editForm, lastServiceDate: e.target.value })} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setEditing(false)}>{t('common.cancel')}</Button>
                        <Button onClick={handleSave} disabled={loading}>{loading ? t('common.loading') : t('common.save')}</Button>
                    </div>
                </div>
            </Card>
        );
    }

    const statusColor = prediction?.status === 'overdue' ? 'text-red-400' : prediction?.status === 'due' ? 'text-yellow-400' : 'text-green-400';
    const progressPercent = Math.min(100, Math.max(0, ((vehicle.odometer - config.lastServiceKm) / config.intervalKm) * 100));

    return (
        <Card className="mb-6 hover:border-white/20 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{t('maintenance.status')}</h2>
                <Button variant="ghost" className="text-xs" onClick={() => setEditing(true)}>{t('maintenance.settings')}</Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted">{t('maintenance.next_service')}</span>
                        <span className="font-mono">{config.lastServiceKm + config.intervalKm} km</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                        <div className={`h-full rounded-full ${prediction?.status === 'overdue' ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="text-center">
                        <span className={`text-2xl font-bold ${statusColor}`}>
                            {prediction ? `${prediction.kmRemaining} km` : '...'}
                        </span>
                    </div>
                </div>

                <div className="flex-1 border-l border-white/10 pl-6 flex flex-col justify-center">
                    <div className="text-sm text-muted mb-1">{t('maintenance.estimated_date')}</div>
                    <div className="text-xl font-bold">
                        {prediction?.predictedDate ? prediction.predictedDate.toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="text-xs text-muted">
                        {prediction?.daysRemaining ? t('maintenance.days_remaining', { days: prediction.daysRemaining }) : 'Need data'}
                    </div>
                </div>
            </div>
        </Card>
    );
}

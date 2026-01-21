"use client";

import React, { useEffect, useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { VehicleForm } from './VehicleForm';
import { useI18n } from '@/lib/i18n';

type Vehicle = {
    id: string;
    name: string;
    type: string;
    // subtype: string; // 已移除
    odometer: number;
};

export function VehicleList() {
    const { t } = useI18n();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/vehicles');
            if (res.ok) {
                const data = await res.json();
                setVehicles(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{t('garage.title')}</h2>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? t('common.close') : t('garage.add_vehicle')}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-6 animate-fade-in">
                    <VehicleForm
                        onSuccess={() => {
                            setShowForm(false);
                            fetchVehicles();
                        }}
                        onCancel={() => setShowForm(false)}
                    />
                </Card>
            )}

            {loading ? (
                <div className="text-muted text-center py-8">{t('common.loading')}</div>
            ) : vehicles.length === 0 ? (
                <div className="text-muted text-center py-8 glass-panel">
                    <p>{t('garage.no_vehicles')}</p>
                    <p className="text-sm">{t('garage.add_first')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                        <Card key={vehicle.id} className="hover:border-blue-500/50 transition-colors cursor-pointer" onClick={() => window.location.href = `/vehicle/${vehicle.id}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{vehicle.name}</h3>
                                    <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300">
                                        {t(`vehicle.type.${vehicle.type}`)}
                                    </span>
                                </div>
                                {/* 这里可以根据类型放置图标 */}
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-xs text-muted uppercase">{t('vehicle.odometer')}</div>
                                    <div className="text-2xl font-mono">{vehicle.odometer.toLocaleString()} <span className="text-sm text-muted">km</span></div>
                                </div>
                                <Button variant="ghost" className="text-xs">
                                    {t('garage.view')}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

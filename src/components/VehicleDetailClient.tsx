"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { FuelList } from '@/components/FuelList';
import { FuelStats } from '@/components/FuelStats';
import { MaintenanceCard } from '@/components/MaintenanceCard';
import { useI18n } from '@/lib/i18n';

type Vehicle = {
    id: string;
    name: string;
    type: string;
    subtype: string | null;
    odometer: number;
    maintenanceConfig?: any;
};

export function VehicleDetailClient({ vehicle }: { vehicle: Vehicle }) {
    const { t } = useI18n();
    const router = useRouter();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    return (
        <div className="layout-container py-8">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <Button variant="ghost" onClick={() => window.location.href = '/'} className="mb-2 pl-0">
                        {t('back.garage')}
                    </Button>
                    <h1 className="text-3xl font-bold">{vehicle.name}</h1>
                    <p className="text-muted">
                        {vehicle.subtype ? t(`vehicle.subtype.${vehicle.subtype.toLowerCase()}`) : vehicle.type} • {vehicle.odometer} km
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => router.push(`/vehicle/${vehicle.id}/add-fuel`)}>
                        {t('add.fuel')}
                    </Button>
                </div>
            </header>

            <MaintenanceCard vehicle={vehicle} refreshTrigger={refreshTrigger} />

            <FuelStats vehicleId={vehicle.id} refreshTrigger={refreshTrigger} />

            <section>
                <h2 className="text-xl font-bold mb-4 mt-8">{t('fuel.history')}</h2>
                <FuelList vehicleId={vehicle.id} refreshTrigger={refreshTrigger} />
            </section>
        </div>
    );
}

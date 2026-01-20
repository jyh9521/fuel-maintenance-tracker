import React, { useState } from 'react';
import { Button } from './ui/Button';
import { useI18n } from '@/lib/i18n';
import { GasStationMap } from './Map/GasStationMap';
import { MaterialInput } from './ui/MaterialInput';

type AddFuelFormProps = {
    vehicleId: string;
    onSuccess: () => void;
    onCancel: () => void;
};

export function AddFuelForm({ vehicleId, onSuccess, onCancel }: AddFuelFormProps) {
    const { t } = useI18n();
    const [showMap, setShowMap] = useState(false);
    const [formData, setFormData] = useState({
        mileage: '',
        liters: '',
        price: '',
        fullTank: true,
        station: '',
        date: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        // ... 相同逻辑
        e.preventDefault();
        try {
            const res = await fetch('/api/fuel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, vehicleId }),
            });
            if (res.ok) onSuccess();
        } catch (_) {
            console.error('Failed to add fuel record');
        }
    };

    const handleStationSelect = (name: string) => {
        setFormData({ ...formData, station: name });
        setShowMap(false);
    };

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in pb-4">
            <MaterialInput
                label={t('fuel.date')}
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />

            {/* 加油站选择行 */}
            <div className="flex gap-2 items-start mb-4">
                <div className="flex-1">
                    <MaterialInput
                        label={t('fuel.station') || 'Gas Station'}
                        type="text"
                        value={formData.station}
                        onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                    />
                </div>
                <Button type="button" variant="secondary" onClick={() => setShowMap(!showMap)} className="h-[56px] rounded-t-lg rounded-b-none border-b-2 border-transparent">
                    {t('map.find_gas')}
                </Button>
            </div>

            {/* 内联地图展开 */}
            {showMap && (
                <div className="mb-4 rounded-lg overflow-hidden animate-expand border border-[var(--md-sys-color-outline)]">
                    <div className="h-[400px]">
                        <GasStationMap onSelect={handleStationSelect} />
                    </div>
                </div>
            )}

            <MaterialInput
                label={t('vehicle.odometer')}
                type="number"
                required
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
                <MaterialInput
                    label={t('fuel.liters')}
                    type="number"
                    step="0.01"
                    required
                    value={formData.liters}
                    onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                />
                <MaterialInput
                    label={t('fuel.price')}
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
            </div>

            <div className="flex items-center gap-2 mb-6 p-2 rounded hover:bg-[var(--md-sys-color-surface-variant)] transition-colors cursor-pointer" onClick={() => setFormData({ ...formData, fullTank: !formData.fullTank })}>
                <input
                    type="checkbox"
                    id="fullTank"
                    checked={formData.fullTank}
                    onChange={(e) => setFormData({ ...formData, fullTank: e.target.checked })}
                    className="w-5 h-5 accent-[var(--md-sys-color-primary)]"
                />
                <label htmlFor="fullTank" className="text-sm cursor-pointer select-none">{t('fuel.full_tank')}</label>
            </div>

            <div className="flex gap-4 justify-end">
                <Button type="button" variant="ghost" onClick={onCancel}>{t('common.cancel')}</Button>
                <Button type="submit">{t('fuel.save_record')}</Button>
            </div>
        </form>
    );
}

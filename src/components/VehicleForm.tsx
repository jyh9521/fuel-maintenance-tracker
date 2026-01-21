import React, { useState } from 'react';
import { Button } from './ui/Button';
import { useI18n } from '@/lib/i18n';

type VehicleFormProps = {
    onSuccess: () => void;
    onCancel: () => void;
};

export function VehicleForm({ onSuccess, onCancel }: VehicleFormProps) {
    const { t } = useI18n();
    const [formData, setFormData] = useState<{
        name: string;
        type: string;
        odometer: string;
    }>({
        name: '',
        type: 'car',
        odometer: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                onSuccess();
            } else {
                const data = await res.json();
                alert(`Error: ${data.message || data.error || 'Unknown error'}`);
            }
        } catch (error: any) {
            console.error(error);
            alert(`Request Failed: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm text-muted mb-1">{t('vehicle.name')}</label>
                <input
                    required
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('placeholder.vehicle_name')}
                />
            </div>

            <div className="grid grid-cols-1 gap-2">
                <div>
                    <label className="block text-sm text-muted mb-1">{t('vehicle.type')}</label>
                    <select
                        className="input"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="car">{t('vehicle.type.car')}</option>
                        <option value="motorcycle">{t('vehicle.type.motorcycle')}</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm text-muted mb-1">{t('vehicle.odometer')}</label>
                <input
                    required
                    type="number"
                    className="input"
                    value={formData.odometer}
                    onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                    placeholder={t('placeholder.odometer')}
                />
            </div>

            <div className="flex gap-2 justify-end mt-4">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    {t('common.cancel')}
                </Button>
                <Button type="submit">
                    {t('vehicle.add_title')}
                </Button>
            </div>
        </form>
    );
}

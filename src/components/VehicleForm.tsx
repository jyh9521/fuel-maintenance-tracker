import React, { useState } from 'react';
import { Button } from './ui/Button';
import { useI18n } from '@/lib/i18n';

type VehicleFormProps = {
    onSuccess: () => void;
    onCancel: () => void;
};

export function VehicleForm({ onSuccess, onCancel }: VehicleFormProps) {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        name: '',
        type: '4wheel',
        subtype: 'Sedan',
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

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        let defaultSubtype = '';
        if (newType === '4wheel') defaultSubtype = 'Sedan';
        else if (newType === '2wheel') defaultSubtype = 'Scooter';
        else if (newType === '3wheel') defaultSubtype = 'Tricycle';

        setFormData({ ...formData, type: newType, subtype: defaultSubtype });
    }

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

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm text-muted mb-1">{t('vehicle.type')}</label>
                    <select
                        className="input"
                        value={formData.type}
                        onChange={handleTypeChange}
                    >
                        <option value="4wheel">{t('vehicle.type.4wheel')}</option>
                        <option value="2wheel">{t('vehicle.type.2wheel')}</option>
                        <option value="3wheel">{t('vehicle.type.3wheel')}</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-muted mb-1">{t('vehicle.subtype')}</label>
                    <select
                        className="input"
                        value={formData.subtype}
                        onChange={(e) => setFormData({ ...formData, subtype: e.target.value })}
                    >
                        {formData.type === '4wheel' && (
                            <>
                                <option value="Sedan">{t('vehicle.subtype.sedan')}</option>
                                <option value="SUV">{t('vehicle.subtype.suv')}</option>
                                <option value="Hatchback">{t('vehicle.subtype.hatchback')}</option>
                                <option value="Truck">{t('vehicle.subtype.truck')}</option>
                            </>
                        )}
                        {formData.type === '2wheel' && (
                            <>
                                <option value="Scooter">{t('vehicle.subtype.scooter')}</option>
                                <option value="Sport">{t('vehicle.subtype.sport')}</option>
                                <option value="Cruiser">{t('vehicle.subtype.cruiser')}</option>
                            </>
                        )}
                        {formData.type === '3wheel' && (
                            <>
                                <option value="Tricycle">{t('vehicle.subtype.tricycle')}</option>
                                <option value="Sidecar">{t('vehicle.subtype.sidecar')}</option>
                            </>
                        )}
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

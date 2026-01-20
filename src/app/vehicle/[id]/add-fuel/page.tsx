"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AddFuelForm } from '@/components/AddFuelForm';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';

export default function AddFuelPage() {
    const router = useRouter();
    const params = useParams();
    const { t } = useI18n();
    const id = params.id as string;

    const handleSuccess = () => {
        router.push(`/vehicle/${id}`);
        router.refresh();
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="layout-container py-8 animate-fade-in">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <Button variant="ghost" onClick={handleCancel} className="mb-2 pl-0">
                        ← {t('common.cancel')}
                    </Button>
                    <h1 className="text-3xl font-bold">{t('fuel.add_title')}</h1>
                </div>
            </header>

            <div className="md-card p-6">
                <AddFuelForm
                    vehicleId={id}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}

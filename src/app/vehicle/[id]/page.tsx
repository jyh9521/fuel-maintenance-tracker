import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { VehicleDetailClient } from '@/components/VehicleDetailClient';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function VehiclePage({ params }: Props) {
    // In Next 15 params is a promise, in 13/14 it's not. 
    // Code assumes standard usage. If error, we await params.
    const { id } = await params;

    const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: { maintenanceConfig: true },
    });

    if (!vehicle) notFound();

    return <VehicleDetailClient vehicle={vehicle} />;
}

import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { VehicleDetailClient } from '@/components/VehicleDetailClient';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function VehiclePage({ params }: Props) {
    // 在 Next 15 中 params 是一个 promise，在 13/14 中不是。
    // 代码假设标准用法。如果出错，我们要 await params。
    const { id } = await params;

    const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: { maintenanceConfig: true },
    });

    if (!vehicle) notFound();

    return <VehicleDetailClient vehicle={vehicle} />;
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const vehicle = await prisma.vehicle.findUnique({
            where: { id },
            include: { maintenanceConfig: true },
        });
        if (!vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(vehicle);
    } catch (_) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        // 支持更新里程表和保养配置
        const { odometer, maintenanceConfig } = body;

        const updateData: any = {};
        if (odometer !== undefined) updateData.odometer = odometer;

        if (maintenanceConfig === null) {
            // 显式删除保养配置
            try {
                // 我们使用 try-catch，因为如果它不存在，delete 可能会失败，或者我们需要在 update 中使用 delete: true
                // 但 updateData 是用于车辆更新的
                updateData.maintenanceConfig = { delete: true };
            } catch (e) { /* 如果已删除则忽略 */ }
        } else if (maintenanceConfig) {
            updateData.maintenanceConfig = {
                upsert: {
                    create: {
                        intervalKm: maintenanceConfig.intervalKm,
                        lastServiceKm: maintenanceConfig.lastServiceKm,
                        lastServiceDate: new Date(maintenanceConfig.lastServiceDate),
                    },
                    update: {
                        intervalKm: maintenanceConfig.intervalKm,
                        lastServiceKm: maintenanceConfig.lastServiceKm,
                        lastServiceDate: new Date(maintenanceConfig.lastServiceDate),
                    }
                }
            };
        }

        const vehicle = await prisma.vehicle.update({
            where: { id },
            data: updateData,
            include: { maintenanceConfig: true },
        });

        return NextResponse.json(vehicle);
    } catch (_) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await prisma.vehicle.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}

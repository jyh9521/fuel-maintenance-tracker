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
            // Explicitly delete maintenance config
            try {
                // We use try-catch because if it doesn't exist, delete might fail or we should use delete: true in update
                // But updateData is for vehicle update.
                updateData.maintenanceConfig = { delete: true };
            } catch (e) { /* ignore if already deleted */ }
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

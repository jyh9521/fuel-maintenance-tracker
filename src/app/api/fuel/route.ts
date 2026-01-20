import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');

    if (!vehicleId) {
        return NextResponse.json({ error: 'Vehicle ID required' }, { status: 400 });
    }

    try {
        const records = await prisma.fuelRecord.findMany({
            where: { vehicleId },
            orderBy: { date: 'desc' },
        });
        return NextResponse.json(records);
    } catch (_) {
        return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { vehicleId, mileage, liters, price, fullTank, date, station } = body;

        const record = await prisma.fuelRecord.create({
            data: {
                vehicleId,
                mileage: parseInt(mileage),
                liters: parseFloat(liters),
                price: parseFloat(price),
                fullTank: fullTank,
                station: station || null,
                date: new Date(date),
            },
        });

        // 如果这是最新的最高里程，则更新车辆里程表
        const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
        if (vehicle && parseInt(mileage) > vehicle.odometer) {
            await prisma.vehicle.update({
                where: { id: vehicleId },
                data: { odometer: parseInt(mileage) },
            });
        }

        return NextResponse.json(record);
    } catch (_) {
        return NextResponse.json({ error: 'Failed to save record' }, { status: 500 });
    }
}

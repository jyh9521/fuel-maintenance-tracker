import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const vehicles = await prisma.vehicle.findMany({
            include: {
                maintenanceConfig: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(vehicles);
    } catch (_) {
        return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
    }
}

const POST = async (request: Request) => {
    try {
        const body = await request.json();
        console.log('Received payload:', body); // 调试日志
        const { name, type, odometer } = body;

        // 验证
        if (!name || !odometer) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const odometerInt = parseInt(odometer);
        if (isNaN(odometerInt)) {
            return NextResponse.json({ error: 'Invalid odometer value' }, { status: 400 });
        }

        const vehicle = await prisma.vehicle.create({
            data: {
                name,
                type,
                odometer: odometerInt,
                maintenanceConfig: {
                    create: {
                        intervalKm: 5000, // 默认值
                        lastServiceKm: odometerInt,
                        lastServiceDate: new Date(),
                    }
                }
            },
        });

        return NextResponse.json(vehicle);
    } catch (e: any) {
        console.error('Create vehicle error:', e);
        return NextResponse.json({ error: e.message || 'Failed to create vehicle' }, { status: 500 });
    }
}
export { POST };

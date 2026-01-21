import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await prisma.fuelRecord.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (_) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}

import { differenceInDays, addDays } from 'date-fns';

export type MaintenanceConfig = {
    intervalKm: number;
    lastServiceKm: number;
    lastServiceDate: Date;
};

export type PredictionResult = {
    predictedDate: Date | null;
    daysRemaining: number | null;
    kmRemaining: number;
    status: 'ok' | 'due' | 'overdue';
};

export function predictMaintenance(
    currentOdometer: number,
    config: MaintenanceConfig,
    dailyAverageKm: number = 20 // 默认值 (后备)
): PredictionResult {
    const nextServiceKm = config.lastServiceKm + config.intervalKm;
    const kmRemaining = nextServiceKm - currentOdometer;

    let status: 'ok' | 'due' | 'overdue' = 'ok';
    if (kmRemaining <= 0) status = 'overdue';
    else if (kmRemaining < 500) status = 'due'; // 警告阈值

    if (dailyAverageKm <= 0) {
        return {
            predictedDate: null,
            daysRemaining: null,
            kmRemaining,
            status,
        };
    }

    const daysUntil = Math.ceil(kmRemaining / dailyAverageKm);
    const predictedDate = addDays(new Date(), daysUntil);

    return {
        predictedDate,
        daysRemaining: daysUntil,
        kmRemaining,
        status,
    };
}

export function calculateDailyAverage(records: { date: Date; mileage: number }[]): number {
    if (records.length < 2) return 0;

    // 按日期降序排序
    const sorted = [...records].sort((a, b) => b.date.getTime() - a.date.getTime());

    // 取可用记录的首尾范围
    const latest = sorted[0];
    const oldest = sorted[sorted.length - 1]; // 或者限制为最近的记录？

    const daysDiff = differenceInDays(latest.date, oldest.date);
    const distDiff = latest.mileage - oldest.mileage;

    if (daysDiff <= 0 || distDiff <= 0) return 0;

    return distDiff / daysDiff;
}

export type FuelRecord = {
    id: string;
    mileage: number;
    liters: number;
    price: number;
    fullTank: boolean;
    date: Date;
};

export type ConsumptionStats = {
    totalDistance: number;
    totalFuel: number;
    totalCost: number;
    averageConsumption: number; // L/100km (每100公里升数)
    averageCostPerKm: number;
    lastConsumption: number | null; // L/100km (最近一次加油)
};

export function calculateConsumption(records: FuelRecord[]): ConsumptionStats {
    if (records.length < 2) {
        return {
            totalDistance: 0,
            totalFuel: 0,
            totalCost: 0,
            averageConsumption: 0,
            averageCostPerKm: 0,
            lastConsumption: null,
        };
    }

    // 按里程升序排序
    const sorted = [...records].sort((a, b) => a.mileage - b.mileage);

    let totalDistance = 0;
    let totalFuel = 0;
    let totalCost = 0;

    // 为了准确性，我们只计算满油记录之间的油耗，
    // 但作为简单的近似计算：
    // 从第二条记录开始遍历。
    // 距离 = 当前里程 - 上次里程
    // 油量 = 当前加油量（覆盖该距离所需的燃油）
    // 注意：这假设当前加油量是为了补充之前行驶消耗的油量。
    // 标准方法：加满 -> 行驶 -> 加满。
    // 第二次加满的油量 = 第一次和第二次之间距离的消耗量。

    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i];
        const prev = sorted[i - 1];

        // 简单逻辑：假设所有都是有效加油。
        // 理想情况下应该处理非满油情况，但对于 MVP 版本：
        const dist = current.mileage - prev.mileage;

        if (dist > 0) {
            totalDistance += dist;
            totalFuel += current.liters;
            totalCost += current.price; // 价格是总支付金额？还是每升单价？
            // Schema 中有 "price"，假设是单次加油的总金额。
        }
    }

    // 最近一次油耗（最新片段）
    const lastRecord = sorted[sorted.length - 1];
    const secondLast = sorted[sorted.length - 2];
    let lastConsumption = null;

    if (lastRecord.fullTank && secondLast) {
        const dist = lastRecord.mileage - secondLast.mileage;
        if (dist > 0) {
            lastConsumption = (lastRecord.liters / dist) * 100;
        }
    }

    const averageConsumption = totalDistance > 0 ? (totalFuel / totalDistance) * 100 : 0;
    const averageCostPerKm = totalDistance > 0 ? totalCost / totalDistance : 0;

    return {
        totalDistance,
        totalFuel,
        totalCost,
        averageConsumption: parseFloat(averageConsumption.toFixed(2)),
        averageCostPerKm: parseFloat(averageCostPerKm.toFixed(2)),
        lastConsumption: lastConsumption ? parseFloat(lastConsumption.toFixed(2)) : null,
    };
}

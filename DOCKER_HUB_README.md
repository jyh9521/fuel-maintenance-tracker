# 🚗 Fuel & Maintenance Tracker | 燃油与保养追踪 | 燃費・メンテナンス

A modern web application for tracking fuel consumption, maintenance records, and service reminders.
车辆管理、油耗追踪与保养预测的现代化 Web 应用。
車両管理、燃費追跡、メンテナンス予測のためのモダンなWebアプリ。

<p align="center">
  <img src="https://raw.githubusercontent.com/jyh9521/fuel-tracker/main/public/fuel-tracker.jpg" width="100%" alt="Banner" />
</p>

---

## 📸 Screenshots | 截图 | スクリーンショット

<p align="center">
  <img src="https://raw.githubusercontent.com/jyh9521/fuel-tracker/main/public/screenshot1.jpg" width="22%" />
  <img src="https://raw.githubusercontent.com/jyh9521/fuel-tracker/main/public/screenshot2.jpg" width="22%" />
  <img src="https://raw.githubusercontent.com/jyh9521/fuel-tracker/main/public/screenshot3.jpg" width="22%" />
  <img src="https://raw.githubusercontent.com/jyh9521/fuel-tracker/main/public/screenshot4.jpg" width="22%" />
</p>

---

## 🇬🇧 English Description

### ✨ Key Features
*   **Multi-Vehicle Management**: Support for cars, motorcycles, tricycles, etc.
*   **Fuel Tracking**: Log refuel details (odometer, liters, price).
*   **Smart Statistics**: Avg consumption (L/100km), cost per km.
*   **Maintenance Prediction**: Predicts next service date based on driving habits.
*   **Mobile Optimized**: PWA support - add to home screen independently.

### 🐳 Quick Start
```bash
docker run -d \
  --name fuel-tracker \
  -p 9521:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  jyh9521/fuel-tracker:latest
```

---

## 🇨🇳 中文介绍

### ✨ 主要功能
*   **多车辆管理**：汽车、摩托车、三轮车全覆盖。
*   **燃油记录**：轻松记录加油详情（里程、油量、价格）。
*   **智能统计**：自动计算平均油耗、每公里成本。
*   **保养预测**：根据驾驶习惯预测下一次保养日期。
*   **移动端适配**：支持 PWA，可添加到手机主屏幕。

### 🐳 快速启动
```bash
docker run -d \
  --name fuel-tracker \
  -p 9521:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  jyh9521/fuel-tracker:latest
```

---

## 🇯🇵 日本語説明

### ✨ 主な機能
*   **複数車両管理**: 自動車、バイクなど複数の車両を管理。
*   **給油記録**: 走行距離、給油量、価格を記録。
*   **スマート統計**: 平均燃費 (L/100km) やコストを自動計算。
*   **メンテナンス予測**: 運転習慣に基づいて次回のサービス日を予測。
*   **モバイル対応**: PWA対応、ホーム画面に追加可能。

### 🐳 クイックスタート
```bash
docker run -d \
  --name fuel-tracker \
  -p 9521:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  jyh9521/fuel-tracker:latest
```

---

## 🔗 Links

*   **GitHub Repository**: [jyh9521/fuel-tracker](https://github.com/jyh9521/fuel-tracker)
*   **Unraid Template**: [jyh9521/unraid-templates](https://github.com/jyh9521/unraid-templates)

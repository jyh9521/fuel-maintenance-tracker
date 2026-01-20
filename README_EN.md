# 🚗 Fuel & Maintenance Tracker

[English](README_EN.md) | [日本語](README_JA.md) | [中文](README.md)

A modern web application for managing your garage, tracking fuel consumption, and predicting maintenance needs.

![App Screenshot](public/screenshot.png)

## ✨ Key Features

*   **Multi-Vehicle Management**: Support for cars, motorcycles, tricycles, and more.
*   **Fuel Tracking**: Easily log refuel details (odometer, liters, price, full tank status).
*   **Smart Statistics**: Automatically calculate average consumption (L/100km), cost per km, and total distance.
*   **Maintenance Prediction**: Intelligently predicts your next service date based on your driving habits.
*   **Gas Station Finder**: Integrated map to locate nearby gas stations.
*   **Multi-language Support**: Native support for English, Japanese, and Chinese.
*   **Mobile Optimized**: Responsive design for both mobile and desktop (Material Design 3).

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Database**: [Prisma](https://www.prisma.io/) (SQLite)
*   **Styling**: [TailwindCSS](https://tailwindcss.com/) + CSS Modules (Material Design 3 Styling)
*   **Maps**: [Leaflet](https://leafletjs.com/) + OpenStreetMap
*   **Deployment**: Docker support

## 🚀 Quick Start

### Local Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/fuel-maintenance-tracker.git
    cd fuel-maintenance-tracker
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Initialize Database**
    ```bash
    npx prisma migrate dev
    ```

4.  **Start Development Server**
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000`.

### 🐳 Docker Deployment

See our detailed [Deployment Guide](DEPLOY.md).

Quick command:

```bash
docker build -t fuel-tracker .
docker run -d -p 9521:9521 -v ./data:/app/prisma/db fuel-tracker
```

## 📂 Project Structure

```
src/
├── app/              # Next.js App Router Pages
├── components/       # React UI Components
├── lib/              # Utilities (Logic, DB, i18n)
└── ...
```

## 🤝 Contributing

Pull requests and issues are welcome!

## 📄 License

MIT License

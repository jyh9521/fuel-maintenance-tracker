# Docker Deployment Guide

[English](DEPLOY_EN.md) | [日本語](DEPLOY_JA.md) | [中文](DEPLOY.md)

This guide describes how to package your Fuel & Maintenance Tracker application and publish it to Docker Hub for deployment on your NAS or other servers.

## Prerequisites

1.  **Docker Desktop** installed and running.
    *   **Download for Windows**: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
    *   *Note: Ensure "Use WSL 2 instead of Hyper-V" is checked during installation. You may need to restart your computer.*
2.  A **Docker Hub** account (Sign up at [hub.docker.com](https://hub.docker.com/)).
3.  Terminal/Command Prompt access.

## Step 1: Login to Docker Hub

Open your terminal and log in to your Docker Hub account:

```bash
docker login
```

Enter your username and password (or access token) when prompted.

## Step 2: Build the Image

Run the following command in the project root directory. Replace `your-username` with your actual Docker Hub username.

```bash
# Build with a tag (version 1.0) and 'latest'
docker build -t your-username/fuel-tracker:1.0 -t your-username/fuel-tracker:latest .
```

*   `your-username`: Your Docker Hub username.
*   `fuel-tracker`: The name looking you want to give your repository.
*   `.`: Indicates the current directory contains the Dockerfile.

## Step 3: Push to Docker Hub

Push the built images to the registry:

```bash
docker push your-username/fuel-tracker:1.0
docker push your-username/fuel-tracker:latest
```

Once completed, you can see your repository at `https://hub.docker.com/r/your-username/fuel-tracker`.

## Step 4: Deploy (Run)

To run the application (e.g., on your NAS), use the following `docker run` command.

**Important**: You need to mount a volume to persist the SQLite database, otherwise your data will be lost when the container restarts.

```bash
docker run -d \
  --name fuel-tracker \
  -p 9521:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  your-username/fuel-tracker:latest
```

*   `-p 9521:9521`: Maps port 9521 of the container to port 9521 of your host.
*   `-v ./data:/app/prisma/db`: Maps a local folder `./data` to the container's database folder. **Ensure the `./data` folder exists locally.**
*   `-e DATABASE_URL=...`: Tells Prisma where to find the database file within the container.

## Architecture & Port

*   **Port**: The application runs on port `9521` by default.
*   **Database**: Uses SQLite. The database file is located at `prisma/dev.db` by default, but we override it via `DATABASE_URL` for persistence.

## Troubleshooting

If you encounter permission issues with the database file on your NAS:
1.  Ensure the mapped local directory is writable.
2.  You may need to adjust the directory permissions (e.g., `chmod 777 ./data`).

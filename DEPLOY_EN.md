# 🐳 Docker Deployment Guide

[中文](DEPLOY.md) | [日本語](DEPLOY_JA.md) | [English](DEPLOY_EN.md)

This guide explains how to deploy the Fuel & Maintenance Tracker application using Docker. You can either pull a pre-built image from Docker Hub or build and publish your own.

## 📦 Option 1: Using Docker Hub Image (Recommended)

### Quick Start

```bash
# Create data directory
mkdir -p ./data

# Run container
docker run -d \
  --name fuel-tracker \
  -p 9521:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  jyh9521/fuel-tracker:latest
```

### Access the Application

After successful deployment, access the app in your browser:
- Local access: `http://localhost:9521`
- Network access: `http://your-server-ip:9521`

### Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  fuel-tracker:
    image: jyh9521/fuel-tracker:latest
    container_name: fuel-tracker
    ports:
      - "9521:9521"
    volumes:
      - ./data:/app/prisma/db
    environment:
      - DATABASE_URL=file:/app/prisma/db/dev.db
      - NODE_ENV=production
    restart: unless-stopped
```

Then run:
```bash
docker-compose up -d
```

## 🛠️ Option 2: Build Your Own Image

### Prerequisites

1. **Docker Desktop** installed and running
   - **Download for Windows**: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - *Note: Check "Use WSL 2 instead of Hyper-V" during installation. Restart may be required*
2. A **Docker Hub** account (Sign up at [hub.docker.com](https://hub.docker.com/))
3. Terminal/Command Prompt access

### Step 1: Login to Docker Hub

```bash
docker login
```

Enter your username and password (or access token) when prompted.

### Step 2: Build the Image

Run the following command in the project root directory. Replace `your-username` with your Docker Hub username.

```bash
# Build with tags (version 1.0 and latest)
docker build -t your-username/fuel-tracker:1.0 -t your-username/fuel-tracker:latest .
```

**Parameter explanation**:
- `your-username`: Your Docker Hub username
- `fuel-tracker`: Repository name for the image
- `.`: Indicates Dockerfile is in current directory

### Step 3: Push to Docker Hub

```bash
docker push your-username/fuel-tracker:1.0
docker push your-username/fuel-tracker:latest
```

Once completed, visit `https://hub.docker.com/r/your-username/fuel-tracker` to view your repository.

### Step 4: Deploy and Run

```bash
docker run -d \
  --name fuel-tracker \
  -p 9521:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  your-username/fuel-tracker:latest
```

## 📋 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | SQLite database file path | `file:./dev.db` | Yes |
| `PORT` | Application port | `9521` | No |
| `NODE_ENV` | Runtime environment | `production` | No |

## 💾 Data Persistence

**Important**: Always mount a volume to persist your data!

```bash
-v ./data:/app/prisma/db
```

This saves the SQLite database file to the host's `./data` directory, ensuring data survives container restarts.

**Recommendation**: Regularly backup the database file in the `./data` directory.

## 🔧 Common Commands

```bash
# View container logs
docker logs fuel-tracker

# Follow logs in real-time
docker logs -f fuel-tracker

# Check container status
docker ps | grep fuel-tracker

# Restart container
docker restart fuel-tracker

# Stop container
docker stop fuel-tracker

# Start container
docker start fuel-tracker

# Remove container
docker rm -f fuel-tracker
```

## 🔄 Updating the Application

```bash
# 1. Pull latest image
docker pull jyh9521/fuel-tracker:latest

# 2. Stop and remove old container
docker stop fuel-tracker
docker rm fuel-tracker

# 3. Start container with new image
docker run -d \
  --name fuel-tracker \
  -p 9521:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  jyh9521/fuel-tracker:latest
```

## 🐛 Troubleshooting

### Database Permission Issues

If you encounter database file permission issues on NAS:

```bash
# Ensure the mounted directory has write permissions
chmod 777 ./data
```

### Port Conflicts

If port 9521 is already in use, map to a different port:

```bash
docker run -d \
  --name fuel-tracker \
  -p 8080:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  jyh9521/fuel-tracker:latest
```

Then access at `http://localhost:8080`

### Container Won't Start

Check detailed logs to diagnose the issue:

```bash
docker logs fuel-tracker
```

### Corrupted Database File

If the database file is corrupted, you can delete and reinitialize:

```bash
# Stop container
docker stop fuel-tracker

# Backup old data (optional)
cp ./data/dev.db ./data/dev.db.backup

# Remove database file
rm ./data/dev.db

# Restart container - app will auto-create new database
docker start fuel-tracker
```

## 🏗️ Architecture

- **Framework**: Next.js 16 (App Router)
- **Database**: Prisma + SQLite
- **Runtime**: Node.js 20
- **Port**: 9521 (customizable)
- **Data Storage**: SQLite file database

## 💡 Best Practices

1. **Data Backup**: Regularly backup the `./data` directory
2. **Use Docker Compose**: Easier management and version control
3. **Reverse Proxy**: Use Nginx or Traefik to add HTTPS support
4. **Resource Limits**: Set memory and CPU limits in production
5. **Log Management**: Configure log rotation to prevent large log files

## 📱 Supported Platforms

- ✅ Docker (Linux/amd64)
- ✅ NAS Devices (Synology, QNAP, etc.)
- ✅ Cloud Servers (AWS, Azure, GCP, etc.)
- ✅ Local Development

## 📄 License

MIT License

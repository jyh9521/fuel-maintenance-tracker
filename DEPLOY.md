# 🐳 Docker 部署指南

[中文](DEPLOY.md) | [日本語](DEPLOY_JA.md) | [English](DEPLOY_EN.md)

本指南介绍如何使用 Docker 部署燃油与保养追踪应用程序。您可以选择从 Docker Hub 拉取现成的镜像，或者自己构建并发布镜像。

## 📦 方式一：使用 Docker Hub 镜像（推荐）

### 快速开始

```bash
# 创建数据目录
mkdir -p ./data

# 运行容器
docker run -d \
  --name fuel-tracker \
  -p 9521:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  jyh9521/fuel-tracker:latest
```

### 访问应用

部署成功后，在浏览器中访问：
- 本地访问：`http://localhost:9521`
- 局域网访问：`http://你的服务器IP:9521`

### 使用 Docker Compose

创建 `docker-compose.yml` 文件：

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

然后运行：
```bash
docker-compose up -d
```

## 🛠️ 方式二：自己构建镜像

### 前置准备

1. **已安装并运行 Docker Desktop**
   - **Windows 下载**: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - *注意：安装时请选中 "Use WSL 2 instead of Hyper-V"，安装后可能需要重启*
2. 拥有 **Docker Hub** 账号（在 [hub.docker.com](https://hub.docker.com/) 注册）
3. 可以使用命令行/终端（Terminal/PowerShell）

### 步骤 1：登录 Docker Hub

```bash
docker login
```

在提示时输入您的用户名和密码（或访问令牌）。

### 步骤 2：构建镜像

在项目根目录下运行以下命令。请将 `your-username` 替换为您的 Docker Hub 用户名。

```bash
# 构建并打上标签（version 1.0 和 latest）
docker build -t your-username/fuel-tracker:1.0 -t your-username/fuel-tracker:latest .
```

**参数说明**：
- `your-username`: 您的 Docker Hub 用户名
- `fuel-tracker`: 镜像仓库名称
- `.`: 表示 Dockerfile 在当前目录

### 步骤 3：推送到 Docker Hub

```bash
docker push your-username/fuel-tracker:1.0
docker push your-username/fuel-tracker:latest
```

完成后，访问 `https://hub.docker.com/r/your-username/fuel-tracker` 查看您的仓库。

### 步骤 4：部署运行

```bash
docker run -d \
  --name fuel-tracker \
  -p 9521:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  your-username/fuel-tracker:latest
```

## 📋 环境变量说明

| 变量名 | 说明 | 默认值 | 必填 |
|--------|------|--------|------|
| `DATABASE_URL` | SQLite 数据库文件路径 | `file:./dev.db` | 是 |
| `PORT` | 应用运行端口 | `9521` | 否 |
| `NODE_ENV` | 运行环境 | `production` | 否 |

## 💾 数据持久化

**重要**：务必挂载数据卷以持久化数据！

```bash
-v ./data:/app/prisma/db
```

这会将 SQLite 数据库文件保存到宿主机的 `./data` 目录，确保容器重启后数据不会丢失。

**建议**：定期备份 `./data` 目录中的数据库文件。

## 🔧 常用命令

```bash
# 查看容器日志
docker logs fuel-tracker

# 实时查看日志
docker logs -f fuel-tracker

# 查看容器状态
docker ps | grep fuel-tracker

# 重启容器
docker restart fuel-tracker

# 停止容器
docker stop fuel-tracker

# 启动容器
docker start fuel-tracker

# 删除容器
docker rm -f fuel-tracker
```

## 🔄 更新应用

```bash
# 1. 拉取最新镜像
docker pull jyh9521/fuel-tracker:latest

# 2. 停止并删除旧容器
docker stop fuel-tracker
docker rm fuel-tracker

# 3. 使用新镜像启动容器
docker run -d \
  --name fuel-tracker \
  -p 9521:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  jyh9521/fuel-tracker:latest
```

## 🐛 故障排除

### 数据库权限问题

如果在 NAS 上遇到数据库文件的权限问题：

```bash
# 确保挂载的目录具有写入权限
chmod 777 ./data
```

### 端口冲突

如果 9521 端口已被占用，可以映射到其他端口：

```bash
docker run -d \
  --name fuel-tracker \
  -p 8080:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  jyh9521/fuel-tracker:latest
```

然后访问 `http://localhost:8080`

### 容器无法启动

查看详细日志排查问题：

```bash
docker logs fuel-tracker
```

### 数据库文件损坏

如果数据库文件损坏，可以删除并重新初始化：

```bash
# 停止容器
docker stop fuel-tracker

# 备份旧数据（可选）
cp ./data/dev.db ./data/dev.db.backup

# 删除数据库文件
rm ./data/dev.db

# 重启容器，应用会自动创建新数据库
docker start fuel-tracker
```

## 🏗️ 架构说明

- **框架**: Next.js 16 (App Router)
- **数据库**: Prisma + SQLite
- **运行时**: Node.js 20
- **端口**: 9521（可自定义）
- **数据存储**: SQLite 文件数据库

## 💡 最佳实践

1. **数据备份**：定期备份 `./data` 目录
2. **使用 Docker Compose**：便于管理和版本控制
3. **反向代理**：使用 Nginx 或 Traefik 添加 HTTPS 支持
4. **资源限制**：在生产环境中设置内存和 CPU 限制
5. **日志管理**：配置日志轮转避免日志文件过大

## 📱 支持的平台

- ✅ Docker (Linux/amd64)
- ✅ NAS 设备 (Synology, QNAP, etc.)
- ✅ 云服务器 (AWS, Azure, GCP, etc.)
- ✅ 本地开发环境

## 📄 许可证

MIT License

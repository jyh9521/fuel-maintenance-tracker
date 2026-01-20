# Docker 部署指南

[English](DEPLOY_EN.md) | [日本語](DEPLOY_JA.md) | [中文](DEPLOY.md)

本指南介绍如何将您的燃油与保养追踪应用程序打包并发布到 Docker Hub，以便部署到您的 NAS 或其他服务器上。

## 前置准备

1.  **已安装并运行 Docker Desktop**。
    *   **Windows 下载地址**: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
    *   *注意：安装过程中请确保选中 "Use WSL 2 instead of Hyper-V"，安装后可能需要重启电脑。*
2.  拥有一个 **Docker Hub** 账号（在 [hub.docker.com](https://hub.docker.com/) 注册）。
3.  可以使用命令行/终端（Terminal/PowerShell）。

## 第一步：登录 Docker Hub

打开您的终端，登录您的 Docker Hub 账号：

```bash
docker login
```

在提示时输入您的用户名和密码（或访问令牌）。

## 第二步：构建镜像

在项目根目录下运行以下命令。请将 `your-username` 替换为您真实的 Docker Hub 用户名。

```bash
# 构建并打上标签（version 1.0 和 latest）
docker build -t your-username/fuel-tracker:1.0 -t your-username/fuel-tracker:latest .
```

*   `your-username`: 您的 Docker Hub 用户名。
*   `fuel-tracker`: 您想要给这个镜像仓库起的名字。
*   `.`: 表示 Dockerfile 就在当前目录下。

## 第三步：推送到 Docker Hub

将构建好的镜像推送到仓库：

```bash
docker push your-username/fuel-tracker:1.0
docker push your-username/fuel-tracker:latest
```

完成后，您可以在 `https://hub.docker.com/r/your-username/fuel-tracker` 看到您的仓库。

## 第四步：部署 (运行)

要在您的环境（例如 NAS）上运行应用程序，请使用以下 `docker run` 命令。

**重要**：您需要挂载一个卷来持久化保存 SQLite 数据库，否则容器重启后您的数据将会丢失。

```bash
docker run -d \
  --name fuel-tracker \
  -p 9521:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  your-username/fuel-tracker:latest
```

*   `-p 9521:9521`: 将容器的 9521 端口映射到宿主机的 9521 端口。
*   `-v ./data:/app/prisma/db`: 将本地的 `./data` 文件夹映射到容器内的数据库文件夹。**请确保本地的 `./data` 文件夹已经存在。**
*   `-e DATABASE_URL=...`: 告诉 Prisma 在容器内的什么位置查找数据库文件。

## 架构与端口

*   **端口**: 应用程序默认运行在 `9521` 端口。
*   **数据库**: 使用 SQLite。默认情况下数据库文件位于 `prisma/dev.db`，但我们通过 `DATABASE_URL` 环境变量将其覆盖以实现持久化。

## 故障排除

如果您在 NAS 上遇到数据库文件的权限问题：
1.  确保挂载的本地目录具有写入权限。
2.  您可能需要调整该目录的权限（例如 `chmod 777 ./data`）。

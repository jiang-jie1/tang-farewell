# Render 长期部署指南

本项目是 Node 全栈应用（Express + Vite 构建产物），适合直接部署为一个 Render Web Service。

## 1. 推送代码到 GitHub

确保以下文件已经在仓库里：

- `render.yaml`
- `package.json`
- `pnpm-lock.yaml`

然后推送到远程分支。

## 2. 在 Render 创建服务

1. 登录 Render 控制台。
2. 点击 New -> Blueprint。
3. 选择你的 GitHub 仓库。
4. Render 会识别 `render.yaml` 并创建 Web Service。

## 3. 配置环境变量

在 Render 的 Environment 页面填写以下关键变量：

必填：

- `JWT_SECRET`
- `ARK_API_KEY`
- `VITE_AMAP_KEY`

可选（使用对应功能时再填）：

- `VITE_APP_ID`
- `OAUTH_SERVER_URL`
- `VITE_OAUTH_PORTAL_URL`
- `OWNER_OPEN_ID`
- `OWNER_NAME`
- `BUILT_IN_FORGE_API_URL`
- `BUILT_IN_FORGE_API_KEY`
- `VITE_FRONTEND_FORGE_API_URL`
- `VITE_FRONTEND_FORGE_API_KEY`
- `VITE_ANALYTICS_ENDPOINT`
- `VITE_ANALYTICS_WEBSITE_ID`

## 4. 构建与启动

`render.yaml` 已配置：

- Build: `corepack enable && pnpm install --frozen-lockfile && pnpm build`
- Start: `pnpm start`

应用启动后会自动监听 Render 提供的 `PORT`。

## 5. 自定义域名（长期访问推荐）

1. Render -> Settings -> Custom Domains。
2. 绑定你的域名。
3. 按提示在 DNS 服务商处添加 CNAME/ALIAS 记录。
4. 等待证书签发完成（HTTPS 自动启用）。

## 6. 自动部署

默认已开启 `autoDeploy: true`。每次 push 到绑定分支会自动重新部署。

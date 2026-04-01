# 本地运行指南

## 前提条件

在本地运行本项目，需要安装以下工具：

- **Node.js** ≥ 18（推荐 22.x）：[nodejs.org](https://nodejs.org/)
- **pnpm** ≥ 10：安装方法 `npm install -g pnpm`
- **MySQL** 8.x 或 **TiDB**（用于用户数据存储）

---

## 第一步：下载代码

从 Manus 管理界面点击 **"Code"** → **"Download all files"** 下载 ZIP 压缩包，解压后进入项目目录：

```bash
cd tang-farewell-map
```

---

## 第二步：安装依赖

```bash
pnpm install
```

---

## 第三步：配置环境变量

在项目根目录创建 `.env` 文件，填入以下内容：

```env
# ===== 必填：数据库 =====
# MySQL 连接字符串，格式：mysql://用户名:密码@主机:端口/数据库名
DATABASE_URL=mysql://root:yourpassword@localhost:3306/tang_farewell_map

# ===== 必填：JWT 密钥（随机字符串，用于 session 签名）=====
JWT_SECRET=your-random-secret-string-at-least-32-chars

# ===== 必填：高德地图 API Key =====
# 申请地址：https://lbs.amap.com/ → 控制台 → 应用管理 → 创建应用 → 添加 Key（Web端JS API）
VITE_AMAP_KEY=your-amap-api-key

# ===== 必填：火山引擎豆包 API Key =====
# 申请地址：https://console.volcengine.com/ark → 开通模型 doubao-seed-2-0-lite-260215 → 获取 API Key
ARK_API_KEY=73b2152b-af29-4df5-ba2b-fcd4ffe1dff9

# ===== 可选：Manus OAuth（本地开发可留空，智能体对话仍可正常使用）=====
VITE_APP_ID=
OAUTH_SERVER_URL=
VITE_OAUTH_PORTAL_URL=
OWNER_OPEN_ID=
OWNER_NAME=

# ===== 可选：S3 文件存储（本地开发可留空）=====
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
```

---

## 第四步：初始化数据库

```bash
pnpm db:push
```

此命令会在 MySQL 中自动创建所需的数据表（`users` 等）。

---

## 第五步：启动开发服务器

```bash
pnpm dev
```

启动成功后，在浏览器打开：

```
http://localhost:3000
```

---

## 各 API Key 申请方法

### 高德地图 API Key

1. 访问 [lbs.amap.com](https://lbs.amap.com/) 并注册/登录
2. 进入「控制台」→「应用管理」→「我的应用」
3. 点击「创建新应用」，填写应用名称
4. 在应用中点击「添加 Key」，服务平台选择 **「Web端（JS API）」**
5. 填写域名白名单：本地开发填 `localhost`，线上部署填您的域名
6. 复制生成的 Key 填入 `.env` 的 `VITE_AMAP_KEY`

> **注意**：高德地图 JS API 每日免费调用量为 **30,000 次**，个人开发完全够用。

### 火山引擎豆包 API Key

1. 访问 [console.volcengine.com/ark](https://console.volcengine.com/ark) 并注册/登录
2. 进入「模型广场」，搜索并开通 `doubao-seed-2-0-lite-260215` 模型
3. 进入「API Key 管理」，点击「创建 API Key」
4. 复制生成的 Key 填入 `.env` 的 `ARK_API_KEY`

> **注意**：火山引擎豆包模型按 Token 计费，新用户通常有免费额度。

---

## 常见问题

**Q：启动时报 `DATABASE_URL` 相关错误？**

A：确保 MySQL 服务已启动，且 `.env` 中的连接字符串格式正确。可以先用 `mysql -u root -p` 测试连接是否正常。

**Q：地图显示空白或"加载失败"？**

A：检查 `VITE_AMAP_KEY` 是否正确填写，并确认高德控制台中该 Key 的域名白名单包含 `localhost`。

**Q：智能体对话无响应？**

A：检查 `ARK_API_KEY` 是否正确，并确认火山引擎控制台中 `doubao-seed-2-0-lite-260215` 模型已开通。

**Q：不需要用户登录功能，可以跳过 OAuth 配置吗？**

A：可以。Manus OAuth 仅用于用户身份验证，地图、诗词、搜索、填词游戏、智能体对话等核心功能均不需要登录即可使用。

---

## 生产环境构建

```bash
pnpm build
pnpm start
```

构建产物在 `dist/` 目录，服务器默认监听 `3000` 端口。

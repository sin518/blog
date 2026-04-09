# Vercel 部署指南

## 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

### 必需的环境变量

1. **DATABASE_URL**
   - 值：你的 PostgreSQL 数据库连接字符串
   - 示例：`postgresql://username:password@host:port/database?sslmode=require`

2. **BETTER_AUTH_SECRET**
   - 值：一个随机生成的密钥（至少 32 个字符）
   - 生成方法：`openssl rand -base64 32` 或使用在线工具生成

3. **BETTER_AUTH_URL**
   - 值：你的 Vercel 应用 URL
   - 示例：`https://your-app-name.vercel.app`

### OAuth 配置（可选，用于社交登录）

4. **GOOGLE_CLIENT_ID**
   - 从 Google Cloud Console 获取

5. **GOOGLE_CLIENT_SECRET**
   - 从 Google Cloud Console 获取

6. **GITHUB_CLIENT_ID**
   - 从 GitHub Developer Settings 获取

7. **GITHUB_CLIENT_SECRET**
   - 从 GitHub Developer Settings 获取

### 文件上传（如果使用 UploadThing）

8. **UPLOADTHING_TOKEN**
   - 从 UploadThing 控制台获取

## 部署步骤

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 在项目设置中添加上述环境变量
4. 重新部署

## 故障排除

如果仍然遇到错误，请检查：

1. 所有必需的环境变量是否正确设置
2. DATABASE_URL 是否包含正确的连接信息
3. BETTER_AUTH_SECRET 是否足够长且随机
4. Vercel 是否有正确的 Node.js 版本（推荐 18.x 或更高）

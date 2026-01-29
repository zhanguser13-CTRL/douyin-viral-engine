# 🚀 部署指南

## 快速部署步骤

### 准备工作

1. **获取 Gemini API Key**
   - 访问 https://aistudio.google.com/app/apikey
   - 登录 Google 账号
   - 点击 "Create API Key"
   - 复制生成的 API Key

2. **选择部署平台**
   - Vercel (推荐 - 最简单)
   - Netlify
   - Cloudflare Pages
   - 其他支持静态网站的平台

---

## 方式 1: Vercel 部署 (推荐)

### 步骤：

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub/GitLab/Bitbucket 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择 "Import Git Repository"
   - 如果还没有推送到 Git，先执行：
     ```bash
     git add .
     git commit -m "Initial commit"
     git remote add origin <your-repo-url>
     git push -u origin main
     ```

3. **配置项目**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **添加环境变量**
   - 在 "Environment Variables" 部分
   - 添加：`GEMINI_API_KEY` = `你的API密钥`
   - 应用到：Production, Preview, Development

5. **部署**
   - 点击 "Deploy"
   - 等待 2-3 分钟
   - 完成！你会得到一个 `.vercel.app` 域名

---

## 方式 2: Netlify 部署

### 步骤：

1. **访问 Netlify**
   - 打开 https://app.netlify.com
   - 登录账号

2. **导入项目**
   - 点击 "Add new site" → "Import an existing project"
   - 连接你的 Git 仓库

3. **配置构建设置**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - 项目已包含 `netlify.toml` 配置文件

4. **添加环境变量**
   - 进入 Site settings → Environment variables
   - 添加：`GEMINI_API_KEY` = `你的API密钥`

5. **部署**
   - 点击 "Deploy site"
   - 完成！你会得到一个 `.netlify.app` 域名

---

## 方式 3: Cloudflare Pages

### 步骤：

1. **访问 Cloudflare Pages**
   - 打开 https://pages.cloudflare.com
   - 登录账号

2. **创建项目**
   - 点击 "Create a project"
   - 连接 Git 仓库

3. **配置构建**
   - Framework preset: None
   - Build command: `npm run build`
   - Build output directory: `dist`

4. **环境变量**
   - 在 Settings → Environment variables
   - 添加：`GEMINI_API_KEY` = `你的API密钥`

5. **部署**
   - 保存并部署
   - 完成！

---

## 本地测试部署版本

在部署前，可以本地测试生产版本：

```bash
# 构建
npm run build

# 预览
npm run preview
```

访问 http://localhost:4173 查看生产版本

---

## 自定义域名

所有平台都支持绑定自定义域名：

1. 在平台的域名设置中添加你的域名
2. 在域名注册商处添加 DNS 记录（CNAME 或 A 记录）
3. 等待 DNS 传播（通常 5-30 分钟）

---

## 常见问题

### Q: API Key 安全吗？
A: 在客户端使用 API Key 有一定风险。建议：
- 在 Google Cloud Console 中限制 API Key 的使用范围
- 设置每日配额限制
- 定期轮换 API Key

### Q: 构建失败怎么办？
A: 检查：
- Node.js 版本是否 >= 18
- 环境变量是否正确配置
- 查看构建日志中的错误信息

### Q: 部署后页面空白？
A: 可能原因：
- 环境变量未配置
- 检查浏览器控制台的错误信息
- 确认 API Key 有效

### Q: 如何更新部署？
A: 推送代码到 Git 仓库，平台会自动重新部署：
```bash
git add .
git commit -m "Update"
git push
```

---

## 性能优化建议

1. **启用 CDN** - 所有推荐平台都自动提供 CDN
2. **压缩资源** - Vite 已自动处理
3. **缓存策略** - 平台会自动配置
4. **监控使用** - 在 Google Cloud Console 监控 API 使用量

---

## 技术支持

如遇到问题：
1. 查看平台的部署日志
2. 检查浏览器控制台
3. 参考 README.md 文档
4. 访问 AI Studio 获取帮助

---

祝部署顺利！🎉

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🔥 抖音爆款引擎 | Douyin Viral Master

专为 30-50 岁女性用户打造的 AI 爆款文案生成工具。融合新闻纪实逻辑与社会心理学分析，生成有理有据的视觉钩子、主播级深度解说与电影感剪辑方案。

## ✨ 核心功能

- 🎯 **深度画像分析** - 双重审核（合规+心理）
- 📱 **9:16 黄金三段式标题** - 视觉权重优化
- 🎬 **导演级剪辑指南** - 包含节奏、BGM、调色建议
- 🔄 **自我进化系统** - 根据反馈持续优化
- 🌐 **双语支持** - 中文/英文界面切换
- 📸 **多媒体输入** - 支持文本、图片、视频分析

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Google Gemini API Key ([获取地址](https://aistudio.google.com/app/apikey))

### 本地运行

1. **克隆项目**
```bash
git clone <your-repo-url>
cd 新闻爆款分析软件
```

2. **安装依赖**
```bash
npm install
```

3. **配置 API Key**
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local，填入你的 Gemini API Key
GEMINI_API_KEY=your_actual_api_key_here
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
打开浏览器访问 `http://localhost:3000`

## 📦 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## 🌐 部署到线上

### 方式 1: Vercel (推荐)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. 点击上方按钮或访问 [Vercel](https://vercel.com)
2. 导入此 Git 仓库
3. 在环境变量中添加 `GEMINI_API_KEY`
4. 点击 Deploy

### 方式 2: Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. 点击上方按钮或访问 [Netlify](https://app.netlify.com)
2. 连接你的 Git 仓库
3. 在 Site settings > Environment variables 中添加 `GEMINI_API_KEY`
4. 部署会自动开始

### 方式 3: 其他平台

本项目是标准的 Vite + React 应用，可以部署到任何支持静态网站的平台：

- **Cloudflare Pages**
- **GitHub Pages**
- **Railway**
- **Render**

部署配置：
- Build Command: `npm run build`
- Output Directory: `dist`
- Node Version: 18+

**重要**: 所有平台都需要配置环境变量 `GEMINI_API_KEY`

## 🔧 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 6
- **AI 引擎**: Google Gemini 2.0 Flash
- **样式**: Tailwind CSS
- **图标**: Lucide React

## 📝 使用说明

1. **输入内容**: 在文本框中输入视频脚本或画面描述
2. **上传素材** (可选): 支持图片/视频上传进行视觉分析
3. **生成方案**: 点击"开始深度解析"按钮
4. **查看结果**:
   - 趋势分析与画像匹配度
   - 3 套爆款标题方案
   - 剪辑指南与 BGM 建议
   - 互动文案与标签
5. **模型校准**: 如不满意，提供反馈让 AI 自我进化

## 🎨 界面预览

- 🌙 深色主题（红金配色 - 2026 马年特别版）
- 📱 响应式设计，支持移动端
- ✨ 流畅动画与交互效果

## 🔐 安全说明

- API Key 仅在客户端使用，不会发送到第三方服务器
- 建议使用环境变量管理敏感信息
- 生产环境请使用 API Key 限制和配额管理

## 📄 许可证

本项目仅供学习和研究使用。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请访问 [AI Studio](https://ai.studio/apps/drive/1G1IS1n4UxrXqzqw8VGiQXD0M4BDv77PQ)

---

Made with ❤️ by Rong-Media AI v4.0

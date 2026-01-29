#!/bin/bash

# 抖音爆款引擎 - 快速部署脚本

echo "🔥 抖音爆款引擎 - 部署准备"
echo "================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js"
    echo "请访问 https://nodejs.org 下载安装"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo ""

# 检查 .env.local
if [ ! -f .env.local ]; then
    echo "⚠️  未找到 .env.local 文件"
    echo "正在创建..."
    cp .env.example .env.local
    echo ""
    echo "📝 请编辑 .env.local 文件，填入你的 Gemini API Key"
    echo "   获取地址: https://aistudio.google.com/app/apikey"
    echo ""
    read -p "按回车键继续..."
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo ""
echo "✅ 依赖安装成功"
echo ""

# 构建项目
echo "🔨 构建生产版本..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo ""
echo "✅ 构建成功"
echo ""

# 显示下一步
echo "================================"
echo "🎉 准备完成！"
echo ""
echo "下一步操作："
echo ""
echo "1️⃣  本地测试:"
echo "   npm run preview"
echo ""
echo "2️⃣  部署到 Vercel (推荐):"
echo "   - 访问 https://vercel.com"
echo "   - 导入此项目"
echo "   - 配置环境变量 GEMINI_API_KEY"
echo "   - 点击部署"
echo ""
echo "3️⃣  部署到 Netlify:"
echo "   - 访问 https://app.netlify.com"
echo "   - 导入此项目"
echo "   - 配置环境变量 GEMINI_API_KEY"
echo "   - 点击部署"
echo ""
echo "📖 详细部署指南请查看 DEPLOYMENT.md"
echo "================================"

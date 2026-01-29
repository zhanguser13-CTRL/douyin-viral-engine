@echo off
REM 抖音爆款引擎 - Windows 快速部署脚本

echo 🔥 抖音爆款引擎 - 部署准备
echo ================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: 未安装 Node.js
    echo 请访问 https://nodejs.org 下载安装
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
node -v
echo.

REM 检查 .env.local
if not exist .env.local (
    echo ⚠️  未找到 .env.local 文件
    echo 正在创建...
    copy .env.example .env.local
    echo.
    echo 📝 请编辑 .env.local 文件，填入你的 Gemini API Key
    echo    获取地址: https://aistudio.google.com/app/apikey
    echo.
    pause
)

REM 安装依赖
echo 📦 安装依赖...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo.
echo ✅ 依赖安装成功
echo.

REM 构建项目
echo 🔨 构建生产版本...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

echo.
echo ✅ 构建成功
echo.

REM 显示下一步
echo ================================
echo 🎉 准备完成！
echo.
echo 下一步操作：
echo.
echo 1️⃣  本地测试:
echo    npm run preview
echo.
echo 2️⃣  部署到 Vercel (推荐):
echo    - 访问 https://vercel.com
echo    - 导入此项目
echo    - 配置环境变量 GEMINI_API_KEY
echo    - 点击部署
echo.
echo 3️⃣  部署到 Netlify:
echo    - 访问 https://app.netlify.com
echo    - 导入此项目
echo    - 配置环境变量 GEMINI_API_KEY
echo    - 点击部署
echo.
echo 📖 详细部署指南请查看 DEPLOYMENT.md
echo ================================
echo.
pause

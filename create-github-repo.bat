@echo off
echo 正在创建 GitHub 仓库...
echo.

REM 使用 GitHub Desktop 或 Git 命令创建仓库
echo 请在 GitHub Desktop 中执行以下操作：
echo 1. 点击 "Publish repository" 按钮
echo 2. 仓库名称建议：douyin-viral-master
echo 3. 描述：抖音爆款引擎 - AI 文案生成工具
echo 4. 取消勾选 "Keep this code private"（如果想公开）
echo 5. 点击 "Publish Repository"
echo.
echo 或者手动在浏览器中创建：
echo 1. 访问 https://github.com/new
echo 2. Repository name: douyin-viral-master
echo 3. Description: 抖音爆款引擎 - AI 文案生成工具
echo 4. 选择 Public 或 Private
echo 5. 不要勾选 "Add a README file"
echo 6. 点击 "Create repository"
echo 7. 复制仓库 URL 并运行：
echo    git remote add origin https://github.com/zhanguser13-CTRL/douyin-viral-master.git
echo    git push -u origin master
echo.
pause

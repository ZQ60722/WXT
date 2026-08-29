@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo 检查端口 3000 是否被占用...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo 发现端口 3000 被占用，PID: %%a
    echo 正在终止占用进程...
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 1 /nobreak >nul
)

echo 正在启动前端服务器...
start /B python -m http.server 3000 --bind 127.0.0.1
timeout /t 2 /nobreak >nul

echo 服务器已启动，正在打开浏览器...
start "" http://127.0.0.1:3000
echo.
echo ========================================
echo 前端服务器运行中: http://127.0.0.1:3000
echo 后端 API 地址: http://127.0.0.1:8000
echo 按 Ctrl+C 停止服务器
echo ========================================
pause
@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo 检查端口 8000 是否被占用...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo 发现端口 8000 被占用，PID: %%a
    echo 正在终止占用进程...
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 1 /nobreak >nul
)

echo 正在启动后端服务...
python main.py
pause

@echo off
chcp 65001 >nul

echo ========================================
echo   岭南农遗服务生态平台 - 一键启动
echo ========================================
echo.

echo [1/2] 正在启动后端服务...
pushd "%~dp0backend"
start "后端服务 - 端口8000" cmd /k python main.py
popd

timeout /t 3 /nobreak >nul

echo [2/2] 正在启动前端服务...
pushd "%~dp0"
start "前端服务 - 端口3000" cmd /k python -m http.server 3000 --bind 127.0.0.1
popd

timeout /t 2 /nobreak >nul

echo 正在打开浏览器...
start "" http://127.0.0.1:3000

echo.
echo ========================================
echo   启动完成！
echo.
echo   前端: http://127.0.0.1:3000
echo   后端: http://127.0.0.1:8000
echo   API文档: http://127.0.0.1:8000/api/docs
echo ========================================
echo.
echo 关闭两个黑色命令行窗口即可停止服务
pause

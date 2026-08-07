# 增城荔枝文化遗产数字化平台 - 部署镜像（用于 Koyeb 等容器平台）
FROM python:3.11-slim

WORKDIR /app

# 安装 Python 依赖（构建缓存层）
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 后端代码
COPY backend/ ./backend/

# 前端静态文件（运行时由 FastAPI 同一进程托管，用户只访问一个网址）
COPY index.html ./frontend/index.html
COPY add.txt ./frontend/add.txt
COPY CSS/ ./frontend/CSS/
COPY JS/ ./frontend/JS/
COPY pages/ ./frontend/pages/
COPY img/ ./frontend/img/

# 从 backend 目录启动，保证 `from routers import ...` 可被解析
WORKDIR /app/backend
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

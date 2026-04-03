"""
增城荔枝文化遗产数字化平台 - 后端服务
FastAPI主入口文件
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import uvicorn
import os
import sys

# 添加当前目录到系统路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from routers import terminology, ai_evaluation

# 创建FastAPI应用实例
app = FastAPI(
    title="增城荔枝文化遗产数字化平台 API",
    description="提供术语库管理、用户提交等功能的RESTful API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# 配置CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源（生产环境应限制具体域名）
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库已在 db/lychee_culture.db 中初始化，直接使用
# 如需重新初始化数据，请运行: python init_database.py


# 根路由
@app.get("/")
async def root():
    """API根路径"""
    return {
        "message": "增城荔枝文化遗产数字化平台 API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "endpoints": {
            "terminology": "/api/terminology",
            "ai_chat": "/api/ai/chat",
            "ai_evaluation": "/api/ai/evaluate/translation",
            "detailed_report": "/api/ai/evaluate/detailed-report"
        }
    }


# 健康检查
@app.get("/health")
async def health_check():
    """健康检查端点"""
    return {"status": "healthy", "service": "荔枝文化遗产API"}


# 注册路由
app.include_router(terminology.router)
app.include_router(ai_evaluation.router)


# 全局异常处理
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": f"服务器内部错误: {str(exc)}"}
    )


if __name__ == "__main__":
    # 启动服务器
    print("\n" + "=" * 60)
    print("启动 FastAPI 服务器...")
    print("API文档地址: http://localhost:8000/api/docs")
    print("术语库API: http://localhost:8000/api/terminology")
    print("AI对话API: http://localhost:8000/api/ai/chat")
    print("翻译评估API: http://localhost:8000/api/ai/evaluate/translation")
    print("=" * 60 + "\n")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )

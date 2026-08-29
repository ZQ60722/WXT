# 岭南农遗服务生态平台

> Lingnan Intangible Cultural Heritage - Digital Preservation and Cross-Cultural Communication

岭南农业文化遗产数字化保护与跨文化传播平台，聚焦增城荔枝、潮州单丛茶、化州橘红、新会陈皮、东莞莞香、梅州灵芝六大国家级农业遗产，构建数字化保护与传承体系。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | HTML5 / CSS3 / JavaScript（SPA 单页应用） |
| 可视化 | ECharts 5.4 |
| 后端 | Python FastAPI + Uvicorn |
| 数据库 | SQLite（本地）/ PostgreSQL（生产） |
| AI 服务 | 硅基流动 API（OpenAI 兼容接口） |

---

## 项目结构

```
Web - 副本/
├── index.html                # 前端入口（SPA 主页）
├── CSS/                      # 样式文件
│   ├── style.css             # 全局样式
│   ├── theme.css             # 主题样式
│   ├── detail.css            # 详情页样式
│   ├── industry.css          # 产业服务页样式
│   ├── knowledge-graph.css   # 知识图谱页样式
│   ├── style.css             # 通用样式
│   └── tech.css              # 语料库页样式
├── JS/                       # 前端脚本
│   ├── script.js             # 主页逻辑（地图初始化等）
│   ├── home-gallery.js       # 主页画廊
│   ├── home-progress.js      # 主页进度条
│   ├── detail.js             # 详情页逻辑
│   ├── industry.js           # 产业服务页逻辑
│   ├── knowledge-graph.js    # 知识图谱逻辑
│   ├── tech.js / tech2.js    # 语料库页逻辑
│   └── sound.js              # 音效控制
├── pages/                    # 子页面（HTML 片段）
│   ├── tech.html             # 语料库与翻译评估系统
│   ├── industry.html         # 产业服务
│   ├── knowledge-graph.html  # 广东非遗知识图谱
│   └── detail.html           # 详情页
├── img/                      # 图片资源
├── music/                    # 背景音乐
├── backend/                  # 后端服务
│   ├── main.py               # FastAPI 主入口
│   ├── database.py           # 数据库模型与连接
│   ├── init_database.py      # 数据库初始化脚本
│   ├── routers/              # API 路由模块
│   │   ├── terminology.py    # 术语库 API
│   │   └── ai_evaluation.py  # AI 评估 API
│   ├── db/                   # 数据库文件
│   │   └── lychee_culture.db # SQLite 数据库（内置数据）
│   └── start.bat             # 后端启动脚本
├── backend_service.py        # 后端服务管理工具
├── start_frontend.bat        # 前端启动脚本
├── requirements.txt          # Python 依赖清单
└── .env.example              # 环境变量示例
```

---

## 快速开始

### 环境要求

- Python 3.10+
- 现代浏览器（Chrome / Edge / Firefox）

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置环境变量（可选）

如需使用 AI 评估功能，复制 `.env.example` 为 `.env` 并填写 API Key：

```bash
copy .env.example .env
```

编辑 `.env` 文件：

```
SILICONFLOW_API_KEY=sk-your-real-key-here
DATABASE_URL=
```

> `DATABASE_URL` 留空则自动使用本地 SQLite 数据库。

### 3. 启动项目

#### 方式一：双击启动（推荐）

| 组件 | 操作 | 访问地址 |
|------|------|----------|
| 前端 | 双击 `start_frontend.bat` | http://127.0.0.1:3000 |
| 后端 | 双击 `backend/start.bat` | http://localhost:8000 |

#### 方式二：命令行启动

```bash
# 启动前端
python -m http.server 3000 --bind 127.0.0.1

# 启动后端（另开一个终端）
cd backend
python main.py
```

#### 方式三：服务管理脚本

```bash
python backend_service.py start    # 启动后端服务
python backend_service.py status   # 查看状态
python backend_service.py logs     # 查看日志
python backend_service.py stop     # 停止服务
```

---

## API 接口

后端启动后可访问以下接口：

| 接口 | 说明 |
|------|------|
| `GET /` | API 根路径 |
| `GET /health` | 健康检查 |
| `GET /api/terminology` | 术语库查询 |
| `POST /api/ai/chat` | AI 对话 |
| `POST /api/ai/evaluate/translation` | 翻译评估 |
| `POST /api/ai/evaluate/detailed-report` | 详细评估报告 |
| `GET /api/docs` | Swagger API 文档 |
| `GET /api/redoc` | ReDoc API 文档 |

---

## 功能模块

- **主页**：岭南农遗概览，增城荔枝地图展示，灵芝文化图文介绍
- **语料库系统**：术语库管理、翻译评估、AI 对话
- **产业服务**：农遗产业信息展示
- **知识图谱**：广东非遗可视化知识图谱（ECharts）
- **详情页**：农遗项目详细介绍

---

## 数据库

本地数据库文件位于 `backend/db/lychee_culture.db`，已内置初始数据。如需重新初始化：

```bash
cd backend
python init_database.py
```

---

## 注意事项

- 前端为纯静态 SPA，无需 Node.js，使用 Python 内置 HTTP 服务器即可运行
- 后端 AI 功能需要有效的硅基流动 API Key，无 Key 时前端页面仍可正常浏览
- 背景音乐文件较大（`music/七里香.mp3`），首次加载可能需要几秒钟

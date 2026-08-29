"""
一次性脚本：把本地 SQLite 数据迁移到 DATABASE_URL 指向的 Postgres（Supabase）。
仅需在切换数据库时运行一次。

用法（在 backend/ 目录下执行）：
    DATABASE_URL=postgresql://postgres:密码@db.xxx.supabase.co:5432/postgres \
        python migrate_sqlite_to_postgres.py
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import (
    Base, DB_PATH,
    Terminology, ZengchengLychee, AncientPoetry, AcademicPaper, UserSubmission,
)

SRC_URL = f"sqlite:///{DB_PATH}"
DST_URL = os.environ.get("DATABASE_URL")
if not DST_URL:
    raise SystemExit("请先设置环境变量 DATABASE_URL 指向你的 Postgres（Supabase）连接串。")

src_engine = create_engine(SRC_URL, connect_args={"check_same_thread": False})
dst_engine = create_engine(DST_URL)

# 确保目标表结构存在（与本地模型一致）
Base.metadata.create_all(dst_engine)

SrcSession = sessionmaker(bind=src_engine)
DstSession = sessionmaker(bind=dst_engine)

src = SrcSession()
dst = DstSession()

MODELS = [Terminology, ZengchengLychee, AncientPoetry, AcademicPaper, UserSubmission]

for model in MODELS:
    rows = src.query(model).all()
    # 复制除自增主键 id 外的字段，让 Postgres 重新分配 id
    columns = [c.name for c in model.__table__.columns if c.name != "id"]
    count = 0
    for row in rows:
        data = {name: getattr(row, name) for name in columns}
        dst.add(model(**data))
        count += 1
    dst.commit()
    print(f"[ok] {model.__tablename__}: 迁移 {count} 行")

src.close()
dst.close()
print("迁移完成。")

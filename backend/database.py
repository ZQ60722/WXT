"""
增城荔枝文化遗产数字化平台 - 数据库配置
SQLAlchemy模型定义
"""
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# 数据库文件路径
DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db')
DB_PATH = os.path.join(DB_DIR, 'lychee_culture.db')

# 确保数据库目录存在
os.makedirs(DB_DIR, exist_ok=True)

# 创建数据库引擎
engine = create_engine(
    f'sqlite:///{DB_PATH}',
    connect_args={'check_same_thread': False},
    echo=False
)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 声明基类
Base = declarative_base()


class Terminology(Base):
    """
    术语表 - 中国荔枝汇总
    包含荔枝品种的中英文名称和文化内涵
    """
    __tablename__ = "terminologies"
    
    id = Column(Integer, primary_key=True, index=True)
    chinese_term = Column(String(255), nullable=False, index=True, comment="中文术语")
    english_term = Column(Text, nullable=False, comment="英文术语")
    cultural_connotation = Column(Text, nullable=True, comment="文化内涵")
    cultural_connotation_en = Column(Text, nullable=True, comment="文化内涵英文翻译")
    category = Column(String(100), nullable=True, default="荔枝品种", comment="分类")
    created_at = Column(DateTime, default=datetime.now, comment="创建时间")
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, comment="更新时间")
    
    # 创建全文搜索索引
    __table_args__ = (
        Index('idx_terminology_search', 'chinese_term', 'english_term'),
    )
    
    def __repr__(self):
        return f"<Terminology(id={self.id}, chinese='{self.chinese_term}', english='{self.english_term}')>"


class ZengchengLychee(Base):
    """
    增城荔枝表 - 增城
    增城特色荔枝品种信息
    """
    __tablename__ = "zengcheng_lychees"
    
    id = Column(Integer, primary_key=True, index=True)
    chinese_name = Column(String(255), nullable=False, index=True, comment="中文名称")
    english_name = Column(Text, nullable=False, comment="英文名称")
    description = Column(Text, nullable=True, comment="描述/特色")
    description_en = Column(Text, nullable=True, comment="描述英文")
    category = Column(String(100), nullable=True, default="增城特产", comment="分类")
    created_at = Column(DateTime, default=datetime.now, comment="创建时间")
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, comment="更新时间")
    
    __table_args__ = (
        Index('idx_zengcheng_search', 'chinese_name', 'english_name'),
    )
    
    def __repr__(self):
        return f"<ZengchengLychee(id={self.id}, name='{self.chinese_name}')>"


class AncientPoetry(Base):
    """
    古诗词表 - 荔枝古诗词
    与荔枝相关的古诗词及其翻译
    """
    __tablename__ = "ancient_poetries"
    
    id = Column(Integer, primary_key=True, index=True)
    poem_content = Column(Text, nullable=False, comment="诗句")
    poem_content_en = Column(Text, nullable=True, comment="诗句英文翻译")
    poem_title = Column(String(255), nullable=True, comment="诗名")
    author = Column(String(100), nullable=True, comment="作者")
    dynasty = Column(String(50), nullable=True, comment="朝代")
    created_at = Column(DateTime, default=datetime.now, comment="创建时间")
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, comment="更新时间")
    
    __table_args__ = (
        Index('idx_poetry_search', 'poem_content', 'author', 'poem_title'),
    )
    
    def __repr__(self):
        return f"<AncientPoetry(id={self.id}, title='{self.poem_title}', author='{self.author}')>"


class AcademicPaper(Base):
    """
    学术文献表 - 知网文献研究爬取
    荔枝相关学术研究文献
    """
    __tablename__ = "academic_papers"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False, comment="篇名")
    title_en = Column(Text, nullable=True, comment="篇名英文翻译")
    author = Column(String(200), nullable=True, comment="作者")
    journal = Column(String(200), nullable=True, comment="刊名")
    journal_en = Column(String(300), nullable=True, comment="刊名英文翻译")
    created_at = Column(DateTime, default=datetime.now, comment="创建时间")
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, comment="更新时间")
    
    __table_args__ = (
        Index('idx_paper_search', 'title', 'author', 'journal'),
    )
    
    def __repr__(self):
        return f"<AcademicPaper(id={self.id}, title='{self.title[:30]}...')>"


class UserSubmission(Base):
    """
    用户提交表
    存储用户提交的荔枝文化相关内容
    """
    __tablename__ = "user_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    feeling = Column(Text, nullable=False, comment="用户感受")
    story = Column(Text, nullable=False, comment="用户故事")
    name = Column(String(100), nullable=False, comment="姓名")
    age = Column(Integer, nullable=True, comment="年龄")
    country = Column(String(100), nullable=False, comment="国家/地区")
    created_at = Column(DateTime, default=datetime.now, comment="创建时间")
    
    def __repr__(self):
        return f"<UserSubmission(id={self.id}, name='{self.name}', country='{self.country}')>"


def init_db():
    """
    初始化数据库，创建所有表
    """
    print(f"数据库路径: {DB_PATH}")
    Base.metadata.create_all(bind=engine)
    print("数据库表创建完成!")
    
    # 显示创建的表
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"\n已创建的表 ({len(tables)}个):")
    for table in tables:
        print(f"  - {table}")


def get_db():
    """
    获取数据库会话（用于FastAPI依赖注入）
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


if __name__ == "__main__":
    # 直接运行此文件时初始化数据库
    print("=" * 60)
    print("初始化数据库...")
    print("=" * 60)
    init_db()
    print("\n数据库初始化完成!")
    print(f"数据库文件: {DB_PATH}")

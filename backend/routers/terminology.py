"""
增城荔枝文化遗产API路由
提供术语、增城荔枝、古诗词、学术文献的查询功能
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db, Terminology, ZengchengLychee, AncientPoetry, AcademicPaper

router = APIRouter(
    prefix="/api/terminology",
    tags=["terminology"],
    responses={404: {"description": "Not found"}},
)


# ==================== Pydantic模型定义 ====================

# ----- 术语表模型 -----
class TerminologyBase(BaseModel):
    """术语基础模型"""
    chinese_term: str
    english_term: str
    cultural_connotation: Optional[str] = None
    cultural_connotation_en: Optional[str] = None
    category: Optional[str] = "荔枝品种"


class TerminologyResponse(TerminologyBase):
    """术语响应模型"""
    id: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


# ----- 增城荔枝模型 -----
class ZengchengLycheeBase(BaseModel):
    """增城荔枝基础模型"""
    chinese_name: str
    english_name: str
    description: Optional[str] = None
    description_en: Optional[str] = None
    category: Optional[str] = "增城特产"


class ZengchengLycheeResponse(ZengchengLycheeBase):
    """增城荔枝响应模型"""
    id: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


# ----- 古诗词模型 -----
class AncientPoetryBase(BaseModel):
    """古诗词基础模型"""
    poem_content: str
    poem_content_en: Optional[str] = None
    poem_title: Optional[str] = None
    author: Optional[str] = None
    dynasty: Optional[str] = None


class AncientPoetryResponse(AncientPoetryBase):
    """古诗词响应模型"""
    id: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


# ----- 学术文献模型 -----
class AcademicPaperBase(BaseModel):
    """学术文献基础模型"""
    title: str
    title_en: Optional[str] = None
    author: Optional[str] = None
    journal: Optional[str] = None
    journal_en: Optional[str] = None


class AcademicPaperResponse(AcademicPaperBase):
    """学术文献响应模型"""
    id: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


# ----- 通用列表响应模型 -----
class TerminologyListResponse(BaseModel):
    """术语列表响应"""
    total: int
    items: List[TerminologyResponse]


class ZengchengLycheeListResponse(BaseModel):
    """增城荔枝列表响应"""
    total: int
    items: List[ZengchengLycheeResponse]


class AncientPoetryListResponse(BaseModel):
    """古诗词列表响应"""
    total: int
    items: List[AncientPoetryResponse]


class AcademicPaperListResponse(BaseModel):
    """学术文献列表响应"""
    total: int
    items: List[AcademicPaperResponse]


# ----- 搜索响应模型 -----
class SearchResultItem(BaseModel):
    """搜索结果项"""
    type: str  # terminology, zengcheng, poetry, paper
    id: int
    title: str
    subtitle: Optional[str] = None
    content: Optional[str] = None


class SearchResponse(BaseModel):
    """搜索响应"""
    query: str
    total: int
    results: List[SearchResultItem]


# ==================== 术语表API ====================

@router.get("/", response_model=TerminologyListResponse)
async def get_terminologies(
    skip: int = Query(0, ge=0, description="跳过数量"),
    limit: int = Query(100, ge=1, le=1000, description="返回数量限制"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    category: Optional[str] = Query(None, description="分类筛选"),
    db: Session = Depends(get_db)
):
    """
    获取术语列表（中国荔枝品种汇总）
    
    - skip: 跳过的记录数（分页用）
    - limit: 返回的最大记录数
    - search: 搜索关键词（匹配中文、英文或文化内涵）
    - category: 按分类筛选
    """
    query = db.query(Terminology)
    
    # 搜索过滤
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Terminology.chinese_term.ilike(search_filter),
                Terminology.english_term.ilike(search_filter),
                Terminology.cultural_connotation.ilike(search_filter)
            )
        )
    
    # 分类过滤
    if category:
        query = query.filter(Terminology.category == category)
    
    # 获取总数
    total = query.count()
    
    # 分页获取数据
    terminologies = query.offset(skip).limit(limit).all()
    
    # 格式化响应数据
    items = []
    for term in terminologies:
        items.append(TerminologyResponse(
            id=term.id,
            chinese_term=term.chinese_term,
            english_term=term.english_term,
            cultural_connotation=term.cultural_connotation,
            cultural_connotation_en=term.cultural_connotation_en,
            category=term.category,
            created_at=term.created_at.isoformat() if term.created_at else None,
            updated_at=term.updated_at.isoformat() if term.updated_at else None
        ))
    
    return TerminologyListResponse(total=total, items=items)


@router.get("/detail/{term_id}", response_model=TerminologyResponse)
async def get_terminology_detail(
    term_id: int,
    db: Session = Depends(get_db)
):
    """
    根据ID获取单个术语详情
    """
    term = db.query(Terminology).filter(Terminology.id == term_id).first()
    if not term:
        raise HTTPException(status_code=404, detail="术语不存在")
    
    return TerminologyResponse(
        id=term.id,
        chinese_term=term.chinese_term,
        english_term=term.english_term,
        cultural_connotation=term.cultural_connotation,
        cultural_connotation_en=term.cultural_connotation_en,
        category=term.category,
        created_at=term.created_at.isoformat() if term.created_at else None,
        updated_at=term.updated_at.isoformat() if term.updated_at else None
    )


# ==================== 增城荔枝API ====================

@router.get("/zengcheng", response_model=ZengchengLycheeListResponse)
async def get_zengcheng_lychees(
    skip: int = Query(0, ge=0, description="跳过数量"),
    limit: int = Query(100, ge=1, le=1000, description="返回数量限制"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    db: Session = Depends(get_db)
):
    """
    获取增城荔枝列表（增城荔枝细化）
    
    - skip: 跳过的记录数（分页用）
    - limit: 返回的最大记录数
    - search: 搜索关键词（匹配中文名称、英文名称或描述）
    """
    query = db.query(ZengchengLychee)
    
    # 搜索过滤
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                ZengchengLychee.chinese_name.ilike(search_filter),
                ZengchengLychee.english_name.ilike(search_filter),
                ZengchengLychee.description.ilike(search_filter)
            )
        )
    
    # 获取总数
    total = query.count()
    
    # 分页获取数据
    items = query.offset(skip).limit(limit).all()
    
    # 格式化响应数据
    results = []
    for item in items:
        results.append(ZengchengLycheeResponse(
            id=item.id,
            chinese_name=item.chinese_name,
            english_name=item.english_name,
            description=item.description,
            description_en=item.description_en,
            category=item.category,
            created_at=item.created_at.isoformat() if item.created_at else None,
            updated_at=item.updated_at.isoformat() if item.updated_at else None
        ))
    
    return ZengchengLycheeListResponse(total=total, items=results)


@router.get("/zengcheng/{item_id}", response_model=ZengchengLycheeResponse)
async def get_zengcheng_lychee_detail(
    item_id: int,
    db: Session = Depends(get_db)
):
    """
    根据ID获取单个增城荔枝详情
    """
    item = db.query(ZengchengLychee).filter(ZengchengLychee.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="增城荔枝条目不存在")
    
    return ZengchengLycheeResponse(
        id=item.id,
        chinese_name=item.chinese_name,
        english_name=item.english_name,
        description=item.description,
        description_en=item.description_en,
        category=item.category,
        created_at=item.created_at.isoformat() if item.created_at else None,
        updated_at=item.updated_at.isoformat() if item.updated_at else None
    )


# ==================== 古诗词API ====================

@router.get("/poetry", response_model=AncientPoetryListResponse)
async def get_ancient_poetries(
    skip: int = Query(0, ge=0, description="跳过数量"),
    limit: int = Query(100, ge=1, le=1000, description="返回数量限制"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    author: Optional[str] = Query(None, description="按作者筛选"),
    db: Session = Depends(get_db)
):
    """
    获取古诗词列表（荔枝古诗词）
    
    - skip: 跳过的记录数（分页用）
    - limit: 返回的最大记录数
    - search: 搜索关键词（匹配诗句、诗名或作者）
    - author: 按作者筛选
    """
    query = db.query(AncientPoetry)
    
    # 搜索过滤
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                AncientPoetry.poem_content.ilike(search_filter),
                AncientPoetry.poem_title.ilike(search_filter),
                AncientPoetry.author.ilike(search_filter)
            )
        )
    
    # 作者筛选
    if author:
        query = query.filter(AncientPoetry.author == author)
    
    # 获取总数
    total = query.count()
    
    # 分页获取数据
    items = query.offset(skip).limit(limit).all()
    
    # 格式化响应数据
    results = []
    for item in items:
        results.append(AncientPoetryResponse(
            id=item.id,
            poem_content=item.poem_content,
            poem_content_en=item.poem_content_en,
            poem_title=item.poem_title,
            author=item.author,
            dynasty=item.dynasty,
            created_at=item.created_at.isoformat() if item.created_at else None,
            updated_at=item.updated_at.isoformat() if item.updated_at else None
        ))
    
    return AncientPoetryListResponse(total=total, items=results)


@router.get("/poetry/{poetry_id}", response_model=AncientPoetryResponse)
async def get_poetry_detail(
    poetry_id: int,
    db: Session = Depends(get_db)
):
    """
    根据ID获取单个古诗词详情
    """
    item = db.query(AncientPoetry).filter(AncientPoetry.id == poetry_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="古诗词不存在")
    
    return AncientPoetryResponse(
        id=item.id,
        poem_content=item.poem_content,
        poem_content_en=item.poem_content_en,
        poem_title=item.poem_title,
        author=item.author,
        dynasty=item.dynasty,
        created_at=item.created_at.isoformat() if item.created_at else None,
        updated_at=item.updated_at.isoformat() if item.updated_at else None
    )


@router.get("/poetry/authors/list")
async def get_poetry_authors(
    db: Session = Depends(get_db)
):
    """
    获取所有古诗词作者列表（去重）
    """
    authors = db.query(AncientPoetry.author).distinct().all()
    author_list = [a[0] for a in authors if a[0]]
    return {"authors": author_list, "count": len(author_list)}


# ==================== 学术文献API ====================

@router.get("/papers", response_model=AcademicPaperListResponse)
async def get_academic_papers(
    skip: int = Query(0, ge=0, description="跳过数量"),
    limit: int = Query(100, ge=1, le=1000, description="返回数量限制"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    author: Optional[str] = Query(None, description="按作者筛选"),
    journal: Optional[str] = Query(None, description="按刊名筛选"),
    db: Session = Depends(get_db)
):
    """
    获取学术文献列表（知网文献研究爬取）
    
    - skip: 跳过的记录数（分页用）
    - limit: 返回的最大记录数
    - search: 搜索关键词（匹配篇名、作者或刊名）
    - author: 按作者筛选
    - journal: 按刊名筛选
    """
    query = db.query(AcademicPaper)
    
    # 搜索过滤
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                AcademicPaper.title.ilike(search_filter),
                AcademicPaper.title_en.ilike(search_filter),
                AcademicPaper.author.ilike(search_filter),
                AcademicPaper.journal.ilike(search_filter)
            )
        )
    
    # 作者筛选
    if author:
        query = query.filter(AcademicPaper.author == author)
    
    # 刊名筛选
    if journal:
        query = query.filter(AcademicPaper.journal == journal)
    
    # 获取总数
    total = query.count()
    
    # 分页获取数据
    items = query.offset(skip).limit(limit).all()
    
    # 格式化响应数据
    results = []
    for item in items:
        results.append(AcademicPaperResponse(
            id=item.id,
            title=item.title,
            title_en=item.title_en,
            author=item.author,
            journal=item.journal,
            journal_en=item.journal_en,
            created_at=item.created_at.isoformat() if item.created_at else None,
            updated_at=item.updated_at.isoformat() if item.updated_at else None
        ))
    
    return AcademicPaperListResponse(total=total, items=results)


@router.get("/papers/{paper_id}", response_model=AcademicPaperResponse)
async def get_paper_detail(
    paper_id: int,
    db: Session = Depends(get_db)
):
    """
    根据ID获取单个学术文献详情
    """
    item = db.query(AcademicPaper).filter(AcademicPaper.id == paper_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="学术文献不存在")
    
    return AcademicPaperResponse(
        id=item.id,
        title=item.title,
        title_en=item.title_en,
        author=item.author,
        journal=item.journal,
        journal_en=item.journal_en,
        created_at=item.created_at.isoformat() if item.created_at else None,
        updated_at=item.updated_at.isoformat() if item.updated_at else None
    )


@router.get("/papers/authors/list")
async def get_paper_authors(
    db: Session = Depends(get_db)
):
    """
    获取所有文献作者列表（去重）
    """
    authors = db.query(AcademicPaper.author).distinct().all()
    author_list = [a[0] for a in authors if a[0]]
    return {"authors": author_list, "count": len(author_list)}


@router.get("/papers/journals/list")
async def get_paper_journals(
    db: Session = Depends(get_db)
):
    """
    获取所有文献刊名列表（去重）
    """
    journals = db.query(AcademicPaper.journal).distinct().all()
    journal_list = [j[0] for j in journals if j[0]]
    return {"journals": journal_list, "count": len(journal_list)}


# ==================== 全局搜索API ====================

@router.get("/search/all", response_model=SearchResponse)
async def global_search(
    q: str = Query(..., min_length=1, description="搜索关键词"),
    limit: int = Query(100, ge=1, le=500, description="每类返回数量"),
    db: Session = Depends(get_db)
):
    """
    全局搜索 - 同时搜索所有4个表
    
    - q: 搜索关键词
    - limit: 每类返回的最大结果数
    
    返回结果按类型分类：术语、增城荔枝、古诗词、学术文献
    """
    search_filter = f"%{q}%"
    results = []
    
    # 1. 搜索术语表
    terminologies = db.query(Terminology).filter(
        or_(
            Terminology.chinese_term.ilike(search_filter),
            Terminology.english_term.ilike(search_filter),
            Terminology.cultural_connotation.ilike(search_filter)
        )
    ).limit(limit).all()
    
    for term in terminologies:
        results.append(SearchResultItem(
            type="terminology",
            id=term.id,
            title=term.chinese_term,
            subtitle=term.english_term[:80] + "..." if len(term.english_term) > 80 else term.english_term,
            content=term.cultural_connotation
        ))
    
    # 2. 搜索增城荔枝表
    zengcheng_items = db.query(ZengchengLychee).filter(
        or_(
            ZengchengLychee.chinese_name.ilike(search_filter),
            ZengchengLychee.english_name.ilike(search_filter),
            ZengchengLychee.description.ilike(search_filter)
        )
    ).limit(limit).all()
    
    for item in zengcheng_items:
        results.append(SearchResultItem(
            type="zengcheng",
            id=item.id,
            title=item.chinese_name,
            subtitle=item.english_name[:80] + "..." if len(item.english_name) > 80 else item.english_name,
            content=item.description
        ))
    
    # 3. 搜索古诗词表
    poetries = db.query(AncientPoetry).filter(
        or_(
            AncientPoetry.poem_content.ilike(search_filter),
            AncientPoetry.poem_title.ilike(search_filter),
            AncientPoetry.author.ilike(search_filter)
        )
    ).limit(limit).all()
    
    for poetry in poetries:
        results.append(SearchResultItem(
            type="poetry",
            id=poetry.id,
            title=poetry.poem_title or "无题",
            subtitle=f"{poetry.author or '佚名'} - {poetry.poem_content[:40]}...",
            content=poetry.poem_content
        ))
    
    # 4. 搜索学术文献表
    papers = db.query(AcademicPaper).filter(
        or_(
            AcademicPaper.title.ilike(search_filter),
            AcademicPaper.title_en.ilike(search_filter),
            AcademicPaper.author.ilike(search_filter),
            AcademicPaper.journal.ilike(search_filter)
        )
    ).limit(limit).all()
    
    for paper in papers:
        results.append(SearchResultItem(
            type="paper",
            id=paper.id,
            title=paper.title,
            subtitle=f"{paper.author or '未知'} - {paper.journal or '未知期刊'}",
            content=paper.title_en
        ))
    
    return SearchResponse(
        query=q,
        total=len(results),
        results=results
    )


# ==================== 统计信息API ====================

@router.get("/stats/overview")
async def get_statistics(db: Session = Depends(get_db)):
    """
    获取数据库统计概览
    
    返回所有4个表的数据统计信息
    """
    # 获取各表总数
    terminology_count = db.query(Terminology).count()
    zengcheng_count = db.query(ZengchengLychee).count()
    poetry_count = db.query(AncientPoetry).count()
    paper_count = db.query(AcademicPaper).count()
    
    # 获取术语分类统计
    terminology_categories = db.query(
        Terminology.category,
        func.count(Terminology.id).label("count")
    ).group_by(Terminology.category).all()
    
    # 获取古诗词作者统计（前10）
    poetry_authors = db.query(
        AncientPoetry.author,
        func.count(AncientPoetry.id).label("count")
    ).filter(AncientPoetry.author.isnot(None)).group_by(AncientPoetry.author).order_by(func.count(AncientPoetry.id).desc()).limit(10).all()
    
    # 获取文献期刊统计（前10）
    paper_journals = db.query(
        AcademicPaper.journal,
        func.count(AcademicPaper.id).label("count")
    ).filter(AcademicPaper.journal.isnot(None)).group_by(AcademicPaper.journal).order_by(func.count(AcademicPaper.id).desc()).limit(10).all()
    
    return {
        "total_records": {
            "terminology": terminology_count,
            "zengcheng_lychee": zengcheng_count,
            "ancient_poetry": poetry_count,
            "academic_paper": paper_count,
            "total": terminology_count + zengcheng_count + poetry_count + paper_count
        },
        "terminology_categories": [
            {"category": cat, "count": count} for cat, count in terminology_categories if cat
        ],
        "top_poetry_authors": [
            {"author": author, "count": count} for author, count in poetry_authors if author
        ],
        "top_paper_journals": [
            {"journal": journal, "count": count} for journal, count in paper_journals if journal
        ]
    }


# ==================== 快速搜索API ====================

@router.get("/search/quick")
async def quick_search(
    q: str = Query(..., min_length=1, description="搜索关键词"),
    type: Optional[str] = Query(None, description="限定搜索类型: terminology, zengcheng, poetry, paper"),
    limit: int = Query(20, ge=1, le=200, description="返回数量"),
    db: Session = Depends(get_db)
):
    """
    快速搜索（用于自动补全）
    
    - q: 搜索关键词
    - type: 限定搜索类型，不指定则搜索所有类型
    - limit: 返回的最大结果数
    """
    search_filter = f"%{q}%"
    results = []
    
    # 根据类型搜索
    if type is None or type == "terminology":
        terminologies = db.query(Terminology).filter(
            or_(
                Terminology.chinese_term.ilike(search_filter),
                Terminology.english_term.ilike(search_filter)
            )
        ).limit(limit).all()
        
        for term in terminologies:
            results.append({
                "type": "terminology",
                "id": term.id,
                "title": term.chinese_term,
                "subtitle": term.english_term[:60] + "..." if len(term.english_term) > 60 else term.english_term,
                "category": term.category
            })
    
    if type is None or type == "zengcheng":
        items = db.query(ZengchengLychee).filter(
            or_(
                ZengchengLychee.chinese_name.ilike(search_filter),
                ZengchengLychee.english_name.ilike(search_filter)
            )
        ).limit(limit).all()
        
        for item in items:
            results.append({
                "type": "zengcheng",
                "id": item.id,
                "title": item.chinese_name,
                "subtitle": item.english_name[:60] + "..." if len(item.english_name) > 60 else item.english_name,
                "category": item.category
            })
    
    if type is None or type == "poetry":
        poetries = db.query(AncientPoetry).filter(
            or_(
                AncientPoetry.poem_content.ilike(search_filter),
                AncientPoetry.poem_title.ilike(search_filter),
                AncientPoetry.author.ilike(search_filter)
            )
        ).limit(limit).all()
        
        for poetry in poetries:
            results.append({
                "type": "poetry",
                "id": poetry.id,
                "title": poetry.poem_title or "无题",
                "subtitle": f"{poetry.author or '佚名'} - {poetry.poem_content[:30]}...",
                "category": "古诗词"
            })
    
    if type is None or type == "paper":
        papers = db.query(AcademicPaper).filter(
            or_(
                AcademicPaper.title.ilike(search_filter),
                AcademicPaper.author.ilike(search_filter)
            )
        ).limit(limit).all()
        
        for paper in papers:
            results.append({
                "type": "paper",
                "id": paper.id,
                "title": paper.title[:40] + "..." if len(paper.title) > 40 else paper.title,
                "subtitle": f"{paper.author or '未知'} - {paper.journal or '未知期刊'}",
                "category": "学术文献"
            })
    
    return {
        "query": q,
        "type": type,
        "count": len(results),
        "results": results
    }

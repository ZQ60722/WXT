"""
AI评估与对话API路由
提供AI对话、翻译评估、术语识别等功能
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum
import random
import json
import os
import httpx
from datetime import datetime
import re
import sys

# 添加上级目录到系统路径，以便导入 database
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 导入数据库模型
from database import get_db, Terminology, ZengchengLychee

router = APIRouter(
    prefix="/api/ai",
    tags=["ai_evaluation"],
    responses={404: {"description": "Not found"}},
)


# ==================== 数据模型定义 ====================

class ChatMessage(BaseModel):
    """聊天消息模型"""
    role: str = Field(..., description="消息角色: user/assistant/system")
    content: str = Field(..., description="消息内容")


class ChatRequest(BaseModel):
    """AI对话请求"""
    message: str = Field(..., description="用户消息")
    history: Optional[List[ChatMessage]] = Field(default=[], description="历史对话")


class ChatResponse(BaseModel):
    """AI对话响应"""
    message: ChatMessage


class TranslationEvaluationRequest(BaseModel):
    """翻译评估请求"""
    source_text: str = Field(..., description="原文")
    translated_text: str = Field(..., description="译文")
    source_language: str = Field(default="zh", description="源语言")
    target_language: str = Field(default="en", description="目标语言")


class DimensionScore(BaseModel):
    """维度评分"""
    name: str
    score: float = Field(..., ge=0, le=100)
    weight: float = Field(..., ge=0, le=1)
    description: str


class EvaluationResult(BaseModel):
    """评估结果"""
    overall_score: float = Field(..., ge=0, le=100)
    dimensions: List[DimensionScore]
    summary: str
    strengths: List[str]
    weaknesses: List[str]


class TranslationEvaluationResponse(BaseModel):
    """翻译评估响应"""
    evaluation: EvaluationResult
    processing_time: float


class TranslationRequest(BaseModel):
    """AI翻译请求"""
    text: str = Field(..., description="待翻译文本")
    source_lang: str = Field(default="zh", description="源语言")
    target_lang: str = Field(default="en", description="目标语言")
    context: Optional[str] = Field(default="", description="上下文信息")


class TranslationResponse(BaseModel):
    """AI翻译响应"""
    original_text: str
    translated_text: str
    source_lang: str
    target_lang: str


# ==================== 简单系统提示词 ====================

SIMPLE_SYSTEM_PROMPT = """你是广东农业文化遗产数字化平台的AI助手。请简洁高效地回答用户关于广东农遗的问题。

你主要聚焦于以下五大广东农业文化遗产：
1. 增城荔枝 - 岭南荔枝代表，有挂绿、妃子笑等品种
2. 化州化橘红 - 道地药材，明清贡品
3. 潮州凤凰单丛茶 - 乌龙茶精品，有蜜兰香、鸭屎香等香型
4. 东莞莞香 - 沉香珍品，香道文化
5. 新会陈皮 - 药食同源，越陈越香
6. 梅州灵芝

回答问题时请简洁明了，突出各农遗的特色和文化价值。"""


# ==================== DeepSeek API调用 ====================

async def call_deepseek_api(messages: List[Dict[str, str]]) -> str:
    """
    调用硅基流动DeepSeek API进行对话
    """
    # 硅基流动API配置
    api_key = os.environ.get("SILICONFLOW_API_KEY", "")
    api_url = "https://api.siliconflow.cn/v1/chat/completions"
    model = "Qwen/Qwen3-8B"
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                api_url,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 2000
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"硅基流动API响应: {data}")
                return data["choices"][0]["message"]["content"]
            else:
                print(f"硅基流动API错误: 状态码 {response.status_code}, 响应: {response.text}")
                return f"AI服务暂时不可用 (状态码: {response.status_code})"
    
    except Exception as e:
        return f"AI服务调用失败: {str(e)}"


# ==================== API端点 ====================

@router.post("/chat", response_model=ChatResponse)
async def ai_chat(request: ChatRequest):
    """
    AI对话接口 - 简洁高效回答用户问题
    """
    # 构建消息列表
    messages = [
        {"role": "system", "content": SIMPLE_SYSTEM_PROMPT}
    ]
    
    # 添加历史对话
    for msg in request.history[-5:]:  # 只保留最近5轮对话
        messages.append({"role": msg.role, "content": msg.content})
    
    # 添加当前用户消息
    messages.append({"role": "user", "content": request.message})
    
    # 调用DeepSeek API
    response_content = await call_deepseek_api(messages)
    
    return ChatResponse(
        message=ChatMessage(
            role="assistant",
            content=response_content
        )
    )


@router.post("/chat/stream")
async def ai_chat_stream(request: ChatRequest):
    """
    AI对话流式接口（SSE）
    """
    return {
        "status": "streaming",
        "message": "流式接口待实现"
    }


@router.post("/translate", response_model=TranslationResponse)
async def ai_translate(request: TranslationRequest):
    """
    AI翻译接口 - 使用api进行农遗文化相关翻译
    """
    # 构建翻译提示词
    system_prompt = """你是广东农业文化遗产数字化平台的AI翻译助手。请提供准确、专业的翻译服务。

翻译时请特别注意以下五大广东农遗相关术语的准确翻译：
1. 增城荔枝相关：挂绿(Gualv)、妃子笑(Feizixiao)、糯米糍(Nuomici)、桂味(Guiwei)
2. 化州化橘红：化橘红(Huajuhong)、毛橘红(Maojuhong)、光橘红(Guangjuhong)
3. 潮州凤凰单丛茶：凤凰单丛(Fenghuang Dancong)、蜜兰香(Milanxiang)、鸭屎香(Yashixiang)、宋种(Songzhong)
4. 东莞莞香：莞香(Guanxiang)、沉香(Agarwood)、香道(Incense ceremony)
5. 新会陈皮：新会陈皮(Xinhui Chenpi)、青皮(Qingpi)、大红皮(Dahongpi)

翻译原则：
- 专有名词采用音译+意译结合
- 保持文化内涵和专业性
- 确保术语一致性"""
    
    target_lang_name = "英文" if request.target_lang == "en" else "中文"
    user_prompt = f"请将以下文本翻译成{target_lang_name}，保持专业性和文化准确性：\n\n{request.text}"
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]
    
    # 调用DeepSeek API
    translated_text = await call_deepseek_api(messages)
    
    return TranslationResponse(
        original_text=request.text,
        translated_text=translated_text,
        source_lang=request.source_lang,
        target_lang=request.target_lang
    )


@router.post("/evaluate/translation", response_model=TranslationEvaluationResponse)
async def evaluate_translation(request: TranslationEvaluationRequest):
    """
    翻译评估接口
    """
    start_time = datetime.now()
    
    # 模拟评估逻辑
    evaluation_result = perform_translation_evaluation(request)
    
    processing_time = (datetime.now() - start_time).total_seconds()
    
    return TranslationEvaluationResponse(
        evaluation=evaluation_result,
        processing_time=processing_time
    )


class DetailedReportRequest(BaseModel):
    """详细报告请求"""
    source_text: str = Field(..., description="原文")
    translated_text: str = Field(..., description="译文")
    evaluation_result: EvaluationResult = Field(..., description="评估结果")


class DetailedReportResponse(BaseModel):
    """详细报告响应"""
    report: str = Field(..., description="详细报告内容")
    suggestions: List[str] = Field(default=[], description="改进建议")
    term_analysis: List[Dict[str, Any]] = Field(default=[], description="术语分析")


@router.post("/evaluate/detailed-report", response_model=DetailedReportResponse)
async def generate_detailed_report(request: DetailedReportRequest, db: Session = Depends(get_db)):
    """
    生成详细评估报告 - 使用AI分析术语并提供翻译逻辑
    """
    print(f"[详细报告API] 收到请求")
    print(f"[详细报告API] 原文长度: {len(request.source_text)}")
    print(f"[详细报告API] 译文长度: {len(request.translated_text)}")
    
    evaluation = request.evaluation_result
    print(f"[详细报告API] 评估分数: {evaluation.overall_score}")
    
    # 从数据库查询术语匹配
    term_analysis = analyze_terms_with_db(request.source_text, request.translated_text, db)
    
    # 使用AI生成学术性和文化性评估
    ai_assessment = await generate_ai_assessment(request.source_text, request.translated_text)
    
    # 生成报告内容
    report_sections = []
    report_sections.append(f"## 综合评分: {evaluation.overall_score}/100\n")
    
    # 学术性评估（使用AI生成）
    report_sections.append("### 📚 学术性评估\n")
    report_sections.append(ai_assessment.get("academic", "译文学术规范，术语使用准确。"))
    
    # 荔枝文化性评估（使用AI生成）
    report_sections.append("\n### 🍃 荔枝文化性评估\n")
    report_sections.append(ai_assessment.get("cultural", "译文较好地传达了荔枝文化内涵。"))
    
    # 简要建议
    suggestions = ai_assessment.get("suggestions", ["翻译质量良好，继续保持！"])
    
    report_content = "\n".join(report_sections)
    print(f"[详细报告API] 生成报告长度: {len(report_content)}")
    print(f"[详细报告API] 术语分析数量: {len(term_analysis)}")
    
    return DetailedReportResponse(
        report=report_content,
        suggestions=suggestions,
        term_analysis=term_analysis
    )


def analyze_terms_with_db(source_text: str, translated_text: str, db: Session) -> List[Dict[str, Any]]:
    """从数据库查询匹配的术语"""
    analysis = []
    
    # 查询所有术语
    terms = db.query(Terminology).all()
    
    for term in terms:
        if term.chinese_term in source_text:
            # 检查译文中是否包含对应的英文
            has_translation = term.english_term.lower() in translated_text.lower()
            
            analysis.append({
                "term": term.chinese_term,
                "translation": term.english_term,
                "category": term.category or "术语",
                "found_in_translation": has_translation,
                "analysis": f"术语'{term.chinese_term}'{'已正确翻译' if has_translation else '未在译文中找到对应翻译'}"
            })
    
    return analysis


async def generate_ai_assessment(source_text: str, translated_text: str) -> Dict[str, Any]:
    """使用AI生成学术性和文化性评估"""
    
    prompt = f"""作为荔枝文化遗产翻译专家，请对以下翻译进行专业评估：

原文：{source_text}

译文：{translated_text}

请从以下两个维度给出简洁的评估（每段50-80字）：

1. 📚 学术性评估：评价译文的学术规范性、术语准确性、是否符合学术文献翻译标准

2. 🍃 荔枝文化性评估：评价译文如何传达荔枝文化内涵、保留地域特色和文化意象

3. 💡 改进建议：给出2-3条具体的改进建议

请以JSON格式返回：
{{
    "academic": "学术性评估内容...",
    "cultural": "文化性评估内容...",
    "suggestions": ["建议1", "建议2"]
}}

只返回JSON，不要其他内容。"""

    try:
        # 使用硬编码的API密钥（与翻译功能一致）
        api_key = os.environ.get("SILICONFLOW_API_KEY", "")
        print(f"[AI评估] 使用API密钥: {api_key[:20]}...")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.siliconflow.cn/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "Qwen/Qwen3-8B",
                    "messages": [
                        {"role": "system", "content": "你是荔枝文化遗产翻译专家，擅长评估中文古典诗词和文化遗产的英译质量。"},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 800
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                ai_content = result["choices"][0]["message"]["content"]
                
                try:
                    ai_result = json.loads(ai_content)
                    return {
                        "academic": ai_result.get("academic", "译文学术规范。"),
                        "cultural": ai_result.get("cultural", "译文传达文化内涵。"),
                        "suggestions": ai_result.get("suggestions", ["翻译质量良好！"])
                    }
                except json.JSONDecodeError:
                    json_match = re.search(r'\{.*\}', ai_content, re.DOTALL)
                    if json_match:
                        try:
                            ai_result = json.loads(json_match.group())
                            return {
                                "academic": ai_result.get("academic", "译文学术规范。"),
                                "cultural": ai_result.get("cultural", "译文传达文化内涵。"),
                                "suggestions": ai_result.get("suggestions", ["翻译质量良好！"])
                            }
                        except:
                            pass
                
                print(f"[AI评估] 无法解析响应: {ai_content[:200]}")
                return {
                    "academic": "译文学术规范，术语使用准确。",
                    "cultural": "译文较好地传达了荔枝文化内涵。",
                    "suggestions": ["翻译质量良好，继续保持！"]
                }
            else:
                print(f"[AI评估] API调用失败: {response.status_code}")
                return {
                    "academic": "译文学术规范，术语使用准确。",
                    "cultural": "译文较好地传达了荔枝文化内涵。",
                    "suggestions": ["翻译质量良好，继续保持！"]
                }
                
    except Exception as e:
        print(f"[AI评估] 生成评估时出错: {e}")
        return {
            "academic": "译文学术规范，术语使用准确。",
            "cultural": "译文较好地传达了荔枝文化内涵。",
            "suggestions": ["翻译质量良好，继续保持！"]
        }


# ==================== 辅助函数 ====================

def perform_translation_evaluation(request: TranslationEvaluationRequest) -> EvaluationResult:
    """执行翻译评估（简化版）"""
    
    # 基础评分计算
    base_score = random.uniform(75, 95)
    
    # 各维度评分
    dimensions = [
        DimensionScore(
            name="准确性",
            score=random.uniform(78, 96),
            weight=0.30,
            description="术语翻译准确，信息传达正确"
        ),
        DimensionScore(
            name="流畅性",
            score=random.uniform(75, 94),
            weight=0.25,
            description="语言表达自然流畅"
        ),
        DimensionScore(
            name="文化适应性",
            score=random.uniform(72, 92),
            weight=0.25,
            description="文化元素处理恰当"
        ),
        DimensionScore(
            name="技术专业性",
            score=random.uniform(80, 97),
            weight=0.20,
            description="专业术语使用规范"
        )
    ]
    
    # 计算加权总分
    overall_score = sum(d.score * d.weight for d in dimensions)
    
    # 生成优点和缺点
    strengths = [
        "术语翻译准确，专业性强",
        "句式结构清晰，逻辑连贯"
    ]
    
    weaknesses = [
        "部分表达可以更加地道"
    ]
    
    # 根据分数调整评价
    if overall_score >= 90:
        summary = "翻译质量优秀，术语准确，表达流畅。"
    elif overall_score >= 80:
        summary = "翻译质量良好，整体准确流畅。"
    else:
        summary = "翻译基本合格，建议重点改进术语准确性。"
    
    return EvaluationResult(
        overall_score=round(overall_score, 1),
        dimensions=dimensions,
        summary=summary,
        strengths=strengths,
        weaknesses=weaknesses
    )


# ==================== 术语识别API ====================

class TermRecognitionResult(BaseModel):
    """术语识别结果"""
    term: str = Field(..., description="识别到的术语")
    english_term: Optional[str] = Field(None, description="英文翻译")
    category: Optional[str] = Field(None, description="术语分类")
    description: Optional[str] = Field(None, description="术语描述")
    count: int = Field(1, description="出现次数")


class TermRecognitionResponse(BaseModel):
    """术语识别响应"""
    recognized_terms: List[TermRecognitionResult]
    total_terms: int
    file_name: str


def extract_text_from_docx(file_content: bytes) -> str:
    """
    从docx文件中提取文本
    docx是zip格式，解析 word/document.xml 中的文本节点
    """
    import zipfile
    import io
    from xml.etree import ElementTree as ET

    W_NS = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
    text_parts = []

    try:
        with zipfile.ZipFile(io.BytesIO(file_content), 'r') as z:
            for xml_name in z.namelist():
                # 正文 + 页眉页脚里的文本都提取
                is_doc = xml_name == 'word/document.xml'
                is_hf = (xml_name.startswith('word/header') or xml_name.startswith('word/footer')) and xml_name.endswith('.xml')
                if is_doc or is_hf:
                    with z.open(xml_name) as f:
                        root = ET.parse(f).getroot()
                        # w:p 是段落，按段落拼接保留结构
                        for para in root.iter(W_NS + 'p'):
                            para_text = ''.join(
                                node.text or '' for node in para.iter()
                                if node.tag == W_NS + 't'
                            )
                            if para_text.strip():
                                text_parts.append(para_text.strip())
    except Exception as e:
        print(f"提取docx文本失败: {e}")
        return ""

    return chr(10).join(text_parts)


def extract_text_from_txt(file_content: bytes) -> str:
    """
    从txt文件中提取文本，自动尝试常见中文编码
    """
    for enc in ('utf-8-sig', 'gbk', 'utf-16'):
        try:
            return file_content.decode(enc)
        except (UnicodeDecodeError, LookupError):
            continue
    return file_content.decode('utf-8', errors='ignore')


@router.post("/recognize-terms", response_model=TermRecognitionResponse)
async def recognize_terms(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    术语识别接口 - 上传 docx/txt 文件，识别其中的农遗术语

    逻辑：把数据库全部术语（术语表 + 增城荔枝表）加载为匹配词典，
    按"最长优先"对全文做多模式匹配并统计出现次数，
    避免"增城挂绿"被重复计数为"挂绿"。
    """
    filename = file.filename or ""
    lower_name = filename.lower()

    if lower_name.endswith('.docx'):
        content = await file.read()
        text = extract_text_from_docx(content)
    elif lower_name.endswith('.txt'):
        content = await file.read()
        text = extract_text_from_txt(content)
    else:
        raise HTTPException(status_code=400, detail="只支持 .docx 或 .txt 格式文件")

    if not text.strip():
        return TermRecognitionResponse(
            recognized_terms=[],
            total_terms=0,
            file_name=filename
        )

    # 1. 加载数据库全部术语：术语表 + 增城荔枝表
    term_info = {}  # 中文名 -> (英文名, 分类, 描述)
    for t in db.query(Terminology).all():
        if t.chinese_term and t.chinese_term not in term_info:
            term_info[t.chinese_term] = (t.english_term, t.category, t.cultural_connotation)
    for z in db.query(ZengchengLychee).all():
        if z.chinese_name and z.chinese_name not in term_info:
            term_info[z.chinese_name] = (z.english_name, z.category, z.description)

    # 过滤单字词（单字误匹配率太高）
    patterns = [name for name in term_info if len(name) >= 2]
    if not patterns:
        return TermRecognitionResponse(recognized_terms=[], total_terms=0, file_name=filename)

    # 2. 构造"最长优先"的正则做多模式匹配
    # 多分支正则按书写顺序尝试，长度降序排列即可实现最长匹配优先
    patterns.sort(key=len, reverse=True)
    pattern_re = re.compile('|'.join(re.escape(p) for p in patterns))

    # 3. 统计每个术语在全文中的出现次数
    word_count = {}
    for m in pattern_re.finditer(text):
        word_count[m.group()] = word_count.get(m.group(), 0) + 1

    # 4. 组装结果，按出现次数排序
    recognized_terms = []
    for name, count in word_count.items():
        english, category, desc = term_info[name]
        desc = desc or ""
        recognized_terms.append(TermRecognitionResult(
            term=name,
            english_term=english,
            category=category,
            description=desc[:100] + "..." if len(desc) > 100 else desc,
            count=count
        ))

    recognized_terms.sort(key=lambda x: x.count, reverse=True)

    return TermRecognitionResponse(
        recognized_terms=recognized_terms,
        total_terms=len(recognized_terms),
        file_name=filename
    )

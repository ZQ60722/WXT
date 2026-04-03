/**
 * tech2.js - 后端API调用模块
 * 所有与后端交互的API调用逻辑集中在此文件
 */

// API基础配置
const API_BASE_URL = 'http://localhost:8000';

// ==================== AI对话API ====================

/**
 * AI对话API调用
 * @param {string} message - 用户消息
 * @param {Array} history - 历史对话记录
 * @returns {Promise<Object>} AI响应
 */
async function callAIChat(message, history = []) {
    try {
        // 转换历史记录格式
        const formattedHistory = history.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        
        const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                history: formattedHistory
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('AI对话API调用失败:', error);
        throw error;
    }
}

// ==================== AI翻译API ====================

/**
 * AI翻译API调用
 * @param {string} text - 待翻译文本
 * @param {string} sourceLang - 源语言
 * @param {string} targetLang - 目标语言
 * @returns {Promise<Object>} 翻译结果
 */
async function callAITranslation(text, sourceLang, targetLang) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/ai/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                source_lang: sourceLang,
                target_lang: targetLang,
                context: '荔枝文化'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('AI翻译API调用失败:', error);
        throw error;
    }
}

// ==================== 翻译评估API ====================

/**
 * 翻译评估API调用
 * @param {string} sourceText - 原文
 * @param {string} translatedText - 译文
 * @param {string} sourceLang - 源语言
 * @param {string} targetLang - 目标语言
 * @returns {Promise<Object>} 评估结果
 */
async function callTranslationEvaluation(sourceText, translatedText, sourceLang, targetLang) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/ai/evaluate/translation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source_text: sourceText,
                translated_text: translatedText,
                source_language: sourceLang,
                target_language: targetLang,
                domain: '荔枝文化'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.evaluation;
    } catch (error) {
        console.error('翻译评估API调用失败:', error);
        throw error;
    }
}

/**
 * 生成详细评估报告API调用
 * @param {string} sourceText - 原文
 * @param {string} translatedText - 译文
 * @param {Object} evaluationResult - 评估结果
 * @returns {Promise<Object>} 详细报告
 */
async function callDetailedReport(sourceText, translatedText, evaluationResult) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/ai/evaluate/detailed-report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source_text: sourceText,
                translated_text: translatedText,
                evaluation_result: evaluationResult
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('[详细报告API] 返回数据:', data);
        return data;
    } catch (error) {
        console.error('详细报告API调用失败:', error);
        throw error;
    }
}

/**
 * 获取翻译建议API调用
 * @param {string} text - 需要翻译的文本
 * @returns {Promise<Array>} 翻译建议列表
 */
async function callTranslationSuggestions(text) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/ai/suggestions/translation?text=${encodeURIComponent(text)}&source_lang=zh&target_lang=en`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.suggestions;
    } catch (error) {
        console.error('翻译建议API调用失败:', error);
        return [];
    }
}

// ==================== 术语库API ====================

/**
 * 术语识别API调用 - 上传docx文件识别术语
 * @param {File} file - 上传的文件
 * @returns {Promise<Object>} 识别结果
 */
async function callTermRecognition(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/api/ai/recognize-terms`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('术语识别API调用失败:', error);
        throw error;
    }
}

/**
 * 术语库搜索API调用
 * @param {string} query - 搜索关键词
 * @returns {Promise<Array>} 术语列表
 */
async function callTerminologySearch(query) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/terminology/?search=${encodeURIComponent(query)}&limit=10`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('术语库搜索API调用失败:', error);
        throw error;
    }
}

/**
 * 加载增城荔枝数据
 * @returns {Promise<Array>} 增城荔枝品种列表
 */
async function loadZengchengLycheeData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/terminology/zengcheng?limit=100`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // 如果后端有数据，返回后端数据
        if (data.items && data.items.length > 0) {
            return data.items;
        }
        // 后端没有数据，返回本地模拟数据
        return getLocalZengchengData();
    } catch (error) {
        console.error('加载增城荔枝数据失败:', error);
        // API调用失败，使用本地数据
        return getLocalZengchengData();
    }
}

/**
 * 本地增城荔枝数据（Fallback）
 * @returns {Array} 增城荔枝品种列表
 */
function getLocalZengchengData() {
    return [
        { id: 1, chinese_name: "挂绿", english_name: "Gualv (Green-striped Lychee)", description: "增城最珍贵的荔枝品种，果皮有独特的绿色条纹，果肉晶莹剔透", description_en: "The most precious lychee variety in Zengcheng with unique green stripes on the peel" },
        { id: 2, chinese_name: "妃子笑", english_name: "Feizixiao (Concubine's Smile)", description: "因杨贵妃喜爱而得名，果实饱满，果肉多汁甜美", description_en: "Named after Yang Guifei's fondness, plump fruit with juicy and sweet flesh" },
        { id: 3, chinese_name: "糯米糍", english_name: "Nuomici (Glutinous Rice Lychee)", description: "果肉软糯如糯米，核小肉厚，口感极佳", description_en: "Flesh as soft as glutinous rice, small seed and thick flesh" },
        { id: 4, chinese_name: "桂味", english_name: "Guiwei (Osmanthus Flavor)", description: "带有桂花香气，味道清甜，品质上乘", description_en: "With osmanthus fragrance, sweet taste and superior quality" },
        { id: 5, chinese_name: "三月红", english_name: "Sanyuehong (March Red)", description: "每年三月成熟，是最早上市的荔枝品种", description_en: "Ripens in March, the earliest lychee variety to market" },
        { id: 6, chinese_name: "槐枝", english_name: "Huaizhi (Pagoda Branch)", description: "果皮光滑，果肉爽脆清甜，产量稳定", description_en: "Smooth peel, crisp and sweet flesh, stable yield" },
        { id: 7, chinese_name: "仙进奉", english_name: "Xianjinfeng (Immortal Tribute)", description: "古代贡品，品质上乘，果肉细腻", description_en: "Ancient tribute, superior quality with delicate flesh" },
        { id: 8, chinese_name: "水晶球", english_name: "Shuijingqiu (Crystal Ball)", description: "果肉晶莹剔透，如同水晶，口感清甜", description_en: "Crystal clear flesh like crystal, sweet taste" },
        { id: 9, chinese_name: "白糖罂", english_name: "Baitangying (White Sugar Jar)", description: "果肉如白糖般甜美，果皮薄而易剥", description_en: "Flesh as sweet as white sugar, thin and easy-to-peel skin" },
        { id: 10, chinese_name: "黑叶", english_name: "Heiye (Black Leaf)", description: "叶片深绿近黑，果实大而饱满", description_en: "Dark green to black leaves, large and plump fruit" }
    ];
}

/**
 * 根据维度类型加载数据
 * @param {string} dimensionType - 维度类型
 * @returns {Promise<Array>} 数据列表
 */
async function loadDimensionData(dimensionType) {
    const config = {
        'zengcheng': { api: '/api/terminology/zengcheng' },
        'terminology': { api: '/api/terminology/' },
        'poetry': { api: '/api/terminology/poetry' },
        'papers': { api: '/api/terminology/papers' }
    };

    const cfg = config[dimensionType];
    if (!cfg) return [];

    try {
        const response = await fetch(`${API_BASE_URL}${cfg.api}?limit=200`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error(`加载${dimensionType}数据失败:`, error);
        return [];
    }
}

// ==================== 导出模块 ====================

// 将所有API函数挂载到window对象，供tech.js使用
window.TechAPI = {
    // AI对话
    callAIChat,
    // AI翻译
    callAITranslation,
    // 翻译评估
    callTranslationEvaluation,
    callDetailedReport,
    callTranslationSuggestions,
    // 术语库
    callTerminologySearch,
    loadZengchengLycheeData,
    loadDimensionData,
    // 术语识别
    callTermRecognition,
    // 常量
    API_BASE_URL
};

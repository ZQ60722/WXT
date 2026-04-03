/**
 * tech.js - UI交互与业务逻辑模块
 * 负责页面交互、事件处理、UI渲染
 * 所有后端API调用通过 window.TechAPI 进行
 */

// ===== 全局状态管理 =====
const AppState = {
    // 语料库状态
    collectedTerms: [],
    currentDimension: null,
    allTerms: [],

    // 翻译评估状态
    currentDirection: 'zh-en',
    uploadedFiles: [],
    currentTranslation: '',
    assessmentData: null,
    chatHistory: []
};

// ===== 维度配置 =====
const DimensionConfig = {
    'zengcheng': {
        labels: ['🇨🇳 中文', '🇬🇧 English', '📝 特色', '🌐 Description'],
        fields: ['chinese_name', 'english_name', 'description', 'description_en'],
        emptyText: ['暂无名称', 'No name', '暂无描述', 'No description']
    },
    'terminology': {
        labels: ['🇨🇳 中文术语', '🇬🇧 English Term', '📜 文化内涵', '🌐 Cultural EN'],
        fields: ['chinese_term', 'english_term', 'cultural_connotation', 'cultural_connotation_en'],
        emptyText: ['暂无术语', 'No term', '暂无内涵', 'No connotation']
    },
    'poetry': {
        labels: ['📜 诗句', '🌐 Translation', '📖 诗名', '✍️ 作者'],
        fields: ['poem_content', 'poem_content_en', 'poem_title', 'author'],
        emptyText: ['暂无诗句', 'No poem', '无题', '佚名']
    },
    'papers': {
        labels: ['📄 篇名', '🌐 Title EN', '✍️ 作者', '📰 刊名'],
        fields: ['title', 'title_en', 'author', 'journal'],
        emptyText: ['暂无篇名', 'No title', '未知作者', '未知期刊']
    }
};

// ===== 初始化入口 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeCorpusSystem();
    initializeTranslationSystem();
    initializeFileUpload();
    initializeAssessmentSystem();
    initializeScrollSystem();
    initializeAIChatSystem();
    initializeDimensionCards();
});

// ===== 语料库系统 =====
function initializeCorpusSystem() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // 维度选择
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        item.addEventListener('click', function() {
            gridItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            AppState.currentDimension = this.dataset.dimension;
            displayDimensionSentences(AppState.currentDimension);
            loadDimensionCards(AppState.currentDimension);
        });
    });

    // 术语详情模态框
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeTermModal);
    }

    // 默认显示第一个维度
    if (gridItems.length > 0) {
        gridItems[0].click();
    }
}

function displayDimensionSentences(dimension) {
    const container = document.getElementById('dimensionSentences');
    const countElement = document.getElementById('sentenceCount');

    if (!container || !countElement) return;

    // 从后端加载例句数据
    loadDimensionSentencesFromAPI(dimension, container, countElement);
}

async function loadDimensionSentencesFromAPI(dimension, container, countElement) {
    try {
        const dataType = dimension === 'accuracy' ? 'terminology' :
                        dimension === 'fluency' ? 'poetry' :
                        dimension === 'cultural' ? 'zengcheng' :
                        dimension === 'technical' ? 'papers' : 'zengcheng';

        const items = await window.TechAPI.loadDimensionData(dataType);
        const sentences = items.slice(0, 5).map(item => ({
            text: item.chinese_term || item.chinese_name || item.poem_content || item.title || '',
            source: item.category || item.poem_title || item.journal || '语料库'
        }));

        countElement.textContent = `${sentences.length} 条`;

        if (sentences.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>暂无该维度的例句</p></div>';
            return;
        }

        container.innerHTML = sentences.map((item, index) => `
            <div class="sentence-card" data-index="${index}">
                <div class="sentence-text">${escapeHtml(item.text)}</div>
                <div class="sentence-source">📚 ${escapeHtml(item.source)}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('加载例句失败:', error);
        container.innerHTML = '<div class="empty-state"><p>加载失败，请重试</p></div>';
        countElement.textContent = '0 条';
    }
}

async function loadDimensionCards(dimension) {
    const container = document.getElementById('cardsContainer');
    if (!container) return;

    const dimensionMap = {
        'accuracy': 'zengcheng',
        'fluency': 'terminology',
        'cultural': 'poetry',
        'technical': 'papers',
        'consistency': 'zengcheng',
        'completeness': 'terminology'
    };

    const dataType = dimensionMap[dimension] || 'zengcheng';
    const config = DimensionConfig[dataType];

    container.innerHTML = `
        <div class="cards-loading">
            <div class="loading-spinner"></div>
            <span>正在加载数据...</span>
        </div>
    `;

    // 通过 TechAPI 调用后端
    const items = await window.TechAPI.loadDimensionData(dataType);

    if (items.length > 0) {
        renderAcademicCards(items, config, container);
    } else {
        container.innerHTML = `
            <div class="cards-empty">
                <span>📭</span>
                <p>暂无数据</p>
            </div>
        `;
    }
}

function renderAcademicCards(items, config, container) {
    container.innerHTML = items.map((item, index) => {
        const values = config.fields.map((field, i) => {
            return escapeHtml(item[field] || config.emptyText[i]);
        });

        // 存储完整数据到 dataset
        const fullData = JSON.stringify({
            labels: config.labels,
            values: values
        });

        return `
            <div class="academic-data-card" data-index="${index}" data-full='${fullData}' onclick="showCardDetail(this)">
                <div class="card-simple">
                    <div class="card-main-term">
                        <span class="term-cn">${values[0]}</span>
                        <span class="term-divider">|</span>
                        <span class="term-en">${values[1]}</span>
                    </div>
                    <div class="card-hint">点击查看详情</div>
                </div>
            </div>
        `;
    }).join('');
}

function showCardDetail(cardElement) {
    const fullData = JSON.parse(cardElement.dataset.full);
    const { labels, values } = fullData;

    // 创建或获取模态框
    let modal = document.getElementById('cardDetailModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cardDetailModal';
        modal.className = 'card-detail-modal';
        modal.innerHTML = `
            <div class="card-detail-content">
                <div class="card-detail-header">
                    <h3>详细信息</h3>
                    <button class="close-btn" onclick="closeCardDetail()">&times;</button>
                </div>
                <div class="card-detail-body" id="cardDetailBody"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeCardDetail();
        });
    }

    // 填充内容
    const body = document.getElementById('cardDetailBody');
    body.innerHTML = labels.map((label, i) => `
        <div class="detail-row">
            <span class="detail-label">${label}</span>
            <span class="detail-value">${values[i]}</span>
        </div>
    `).join('');

    modal.style.display = 'flex';
}

function closeCardDetail() {
    const modal = document.getElementById('cardDetailModal');
    if (modal) modal.style.display = 'none';
}

async function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchSuggestions');

    if (!resultsContainer) return;

    if (!query) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('active');
        AppState.lastSearchResults = [];
        return;
    }

    resultsContainer.innerHTML = '<div class="search-loading">🔍 搜索中...</div>';
    resultsContainer.classList.add('active');

    try {
        // 通过 TechAPI 调用后端
        const results = await window.TechAPI.callTerminologySearch(query);
        
        // 保存搜索结果到AppState
        AppState.lastSearchResults = results;

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">未找到相关术语</div>';
            return;
        }

        resultsContainer.innerHTML = `
            <div class="search-results-header">
                <span class="search-results-count">找到 ${results.length} 个术语</span>
                <button class="close-search-btn" onclick="closeSearchResults()" title="关闭">×</button>
            </div>
            <div class="search-results-list">
                ${results.map((term, index) => `
                    <div class="search-result-item">
                        <div class="search-result-main" onclick="showTermDetail('${term.id || term.chinese_term || term.term}')">
                            <div class="term-bilingual">
                                <span class="term-name-cn">${escapeHtml(term.chinese_term || term.term)}</span>
                                <span class="term-divider">|</span>
                                <span class="term-name-en">${escapeHtml(term.english_term || term.english || 'No English')}</span>
                            </div>
                            <div class="term-category">${escapeHtml(term.category || '')}</div>
                        </div>
                        <button class="add-to-collection-btn" onclick="event.stopPropagation(); addToCollectionFromSearch(${index})" title="添加到常用术语">
                            +
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('搜索失败:', error);
        resultsContainer.innerHTML = '<div class="no-results">搜索服务暂时不可用，请稍后重试</div>';
    }
}

function closeSearchResults() {
    const resultsContainer = document.getElementById('searchSuggestions');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('active');
    }
}

function addToCollectionFromSearch(index) {
    if (AppState.lastSearchResults && AppState.lastSearchResults[index]) {
        const term = AppState.lastSearchResults[index];
        addToCollection(term);
    }
}

// ===== AI对话系统 =====
function initializeAIChatSystem() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const clearChatBtn = document.getElementById('clearChat');

    if (!chatInput || !sendBtn) return;

    sendBtn.addEventListener('click', function(e) {
        e.preventDefault();
        sendChatMessage();
    });

    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });

    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clearChatHistory();
        });
    }
}

async function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    if (!chatInput || !chatMessages) return;

    const message = chatInput.value.trim();
    if (!message) return;

    appendChatMessage('user', message);
    chatInput.value = '';

    const loadingId = showChatLoading();

    try {
        // 通过 TechAPI 调用后端
        const response = await window.TechAPI.callAIChat(message, AppState.chatHistory);

        removeChatLoading(loadingId);

        if (response?.message?.content) {
            appendChatMessage('assistant', response.message.content);
            AppState.chatHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: response.message.content }
            );
        } else {
            appendChatMessage('system', 'AI响应格式错误');
        }
    } catch (error) {
        removeChatLoading(loadingId);
        console.error('AI对话失败:', error);
        appendChatMessage('system', 'AI服务暂时不可用，请稍后重试');
    }
}

function appendChatMessage(role, content) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;

    const avatar = role === 'user' ? '👤' : role === 'assistant' ? '🤖' : 'ℹ️';
    const name = role === 'user' ? '用户' : role === 'assistant' ? 'AI助手' : '系统';

    // 处理内容：移除开头的换行，保留段落格式
    let processedContent = escapeHtml(content)
        .replace(/^\n+/, '')  // 移除开头的换行
        .replace(/\n{3,}/g, '\n\n')  // 将3个及以上换行替换为2个
        .replace(/\n/g, '<br>');  // 换行转 <br>

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content-wrapper">
            <div class="message-header">
                <span class="message-sender">${name}</span>
            </div>
            <div class="message-content">${processedContent}</div>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showChatLoading() {
    const chatMessages = document.getElementById('chatMessages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message assistant loading';
    loadingDiv.id = 'chat-loading-' + Date.now();
    loadingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content-wrapper">
            <div class="message-content">
                <span class="loading-dots">思考中<span>.</span><span>.</span><span>.</span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingDiv.id;
}

function removeChatLoading(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.remove();
    }
}

function clearChatHistory() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = `
            <div class="chat-message assistant">
                <div class="message-avatar">🤖</div>
                <div class="message-content-wrapper">
                    <div class="message-header">
                        <span class="message-sender">AI助手</span>
                    </div>
                    <div class="message-content">
                        您好！我是AI翻译助手，可以帮助您进行荔枝文化相关的翻译和术语查询。
                    </div>
                </div>
            </div>
        `;
    }
    AppState.chatHistory = [];
}

// ===== 翻译系统 =====
function initializeTranslationSystem() {
    const sourceText = document.getElementById('sourceText');
    const charCount = document.getElementById('charCount');

    if (!sourceText || !charCount) return;

    sourceText.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = `${count} 字符`;

        const translateBtn = document.getElementById('translateBtn');
        if (translateBtn) {
            translateBtn.disabled = count === 0;
        }
    });

    document.getElementById('translateBtn')?.addEventListener('click', performTranslation);
    document.getElementById('clearText')?.addEventListener('click', clearTranslation);
    document.getElementById('loadSample')?.addEventListener('click', loadSampleText);
    document.getElementById('copyResult')?.addEventListener('click', copyTranslation);
    document.getElementById('editResult')?.addEventListener('click', enableEdit);

    // 翻译方向切换
    document.querySelectorAll('.direction-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.direction-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            AppState.currentDirection = this.dataset.direction;
        });
    });
}

async function performTranslation() {
    const sourceText = document.getElementById('sourceText').value.trim();
    if (!sourceText) return;

    const resultDiv = document.getElementById('translationResult');
    resultDiv.innerHTML = '<div class="result-placeholder">🔄 正在翻译中...</div>';

    const sourceLang = AppState.currentDirection === 'zh-en' ? 'zh' : 'en';
    const targetLang = AppState.currentDirection === 'zh-en' ? 'en' : 'zh';

    try {
        // 通过 TechAPI 调用后端
        const data = await window.TechAPI.callAITranslation(sourceText, sourceLang, targetLang);
        
        console.log('翻译API返回数据:', data);

        if (!data || !data.translated_text) {
            console.error('翻译结果为空:', data);
            resultDiv.innerHTML = '<div class="result-placeholder">❌ 翻译结果为空</div>';
            return;
        }

        AppState.currentTranslation = data.translated_text;
        displayTranslation(AppState.currentTranslation);
        await performAssessment(sourceText, AppState.currentTranslation, sourceLang, targetLang);
    } catch (error) {
        console.error('翻译失败:', error);
        resultDiv.innerHTML = '<div class="result-placeholder">❌ 翻译服务暂时不可用，请稍后重试</div>';
    }
}

function displayTranslation(translation) {
    const resultDiv = document.getElementById('translationResult');
    resultDiv.textContent = translation;
    resultDiv.classList.remove('result-placeholder');
}

function clearTranslation() {
    document.getElementById('sourceText').value = '';
    document.getElementById('charCount').textContent = '0 字符';
    document.getElementById('translationResult').innerHTML = '<div class="result-placeholder">翻译结果将在这里显示...</div>';
    document.getElementById('translateBtn').disabled = true;
    AppState.currentTranslation = '';
    clearAssessment();
}

// 荔枝相关示例文本
const SampleTexts = [
    {
        title: "一骑红尘妃子笑",
        text: "一骑红尘妃子笑，无人知是荔枝来。"
    },
    {
        title: "增城荔枝",
        text: "增城荔枝，岭南佳果，以其肉厚核小、清甜爽口而闻名于世。"
    },
    {
        title: "荔枝文化",
        text: "荔枝不仅是一种美味的水果，更承载着深厚的文化内涵，象征着吉祥、美好与团圆。"
    }
];

let currentSampleIndex = 0;

function loadSampleText() {
    // 轮播显示3个荔枝相关示例文本
    const sample = SampleTexts[currentSampleIndex];
    document.getElementById('sourceText').value = sample.text;
    document.getElementById('charCount').textContent = `${sample.text.length} 字符`;
    document.getElementById('translateBtn').disabled = false;

    // 切换到下一个示例
    currentSampleIndex = (currentSampleIndex + 1) % SampleTexts.length;

    console.log(`[示例文本] 已加载: ${sample.title}`);
}

function copyTranslation() {
    if (!AppState.currentTranslation) return;

    navigator.clipboard.writeText(AppState.currentTranslation).then(() => {
        const btn = document.getElementById('copyResult');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ 已复制';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    });
}

function enableEdit() {
    const resultDiv = document.getElementById('translationResult');
    if (resultDiv.querySelector('.result-placeholder')) return;

    resultDiv.contentEditable = true;
    resultDiv.style.border = '2px solid #3b82f6';
    resultDiv.focus();

    resultDiv.addEventListener('blur', function() {
        AppState.currentTranslation = this.textContent;
        this.contentEditable = false;
        this.style.border = '';
        const sourceText = document.getElementById('sourceText').value;
        const sourceLang = AppState.currentDirection === 'zh-en' ? 'zh' : 'en';
        const targetLang = AppState.currentDirection === 'zh-en' ? 'en' : 'zh';
        performAssessment(sourceText, AppState.currentTranslation, sourceLang, targetLang);
    }, { once: true });
}

// ===== 翻译评估系统 =====
function initializeAssessmentSystem() {
    const translateAssessBtn = document.getElementById('translateAssessBtn');
    const viewReportBtn = document.getElementById('viewReportBtn');
    const exportReportBtn = document.getElementById('exportReport');
    const saveResultBtn = document.getElementById('saveResult');
    const closeReportModalBtn = document.getElementById('closeReportModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const reportModal = document.getElementById('reportModal');

    if (!translateAssessBtn || !viewReportBtn) return;

    translateAssessBtn.addEventListener('click', function() {
        const sourceText = document.getElementById('sourceText').value;
        const sourceLang = AppState.currentDirection === 'zh-en' ? 'zh' : 'en';
        const targetLang = AppState.currentDirection === 'zh-en' ? 'en' : 'zh';
        performAssessment(sourceText, AppState.currentTranslation, sourceLang, targetLang);
    });

    viewReportBtn.addEventListener('click', showReportModal);
    exportReportBtn?.addEventListener('click', exportReport);
    saveResultBtn?.addEventListener('click', saveResult);

    // 关闭模态框事件
    closeReportModalBtn?.addEventListener('click', closeReportModal);
    modalCloseBtn?.addEventListener('click', closeReportModal);
    
    // 点击背景关闭
    reportModal?.addEventListener('click', function(e) {
        if (e.target === reportModal) {
            closeReportModal();
        }
    });
}

function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function performAssessment(sourceText, translation, sourceLang, targetLang) {
    if (!sourceText || !translation) return;

    showAssessmentLoading();

    try {
        // 通过 TechAPI 调用后端
        const assessment = await window.TechAPI.callTranslationEvaluation(sourceText, translation, sourceLang, targetLang);
        displayAssessment(assessment);
    } catch (error) {
        console.error('翻译评估失败:', error);
        showAssessmentError('评估服务暂时不可用，请稍后重试');
    }
}

function showAssessmentError(message) {
    const assessmentScore = document.getElementById('assessmentScore');
    const reportSummary = document.getElementById('reportSummary');
    const suggestionsList = document.getElementById('suggestionsList');

    if (assessmentScore) {
        assessmentScore.innerHTML = `
            <span class="score-number">--</span>
            <span class="score-label">评估失败</span>
        `;
    }
    if (reportSummary) reportSummary.textContent = message;
    if (suggestionsList) suggestionsList.innerHTML = '<li>请检查网络连接或稍后重试</li>';
}

function showAssessmentLoading() {
    const assessmentScore = document.getElementById('assessmentScore');
    const reportSummary = document.getElementById('reportSummary');
    const suggestionsList = document.getElementById('suggestionsList');

    if (assessmentScore) {
        assessmentScore.innerHTML = `
            <span class="score-number">...</span>
            <span class="score-label">评估中</span>
        `;
    }

    // 重置各维度显示
    ['accuracy', 'fluency', 'cultural', 'technical'].forEach(key => {
        const fillElement = document.getElementById(`${key}Fill`);
        const scoreElement = document.getElementById(`${key}Score`);
        if (fillElement) fillElement.style.width = '0%';
        if (scoreElement) scoreElement.textContent = '--';
    });

    if (reportSummary) reportSummary.textContent = '正在进行翻译质量评估...';
    if (suggestionsList) suggestionsList.innerHTML = '<li>请稍候...</li>';
}

function displayAssessment(assessment) {
    AppState.assessmentData = assessment;

    const overallScore = assessment.overall_score || assessment.overall || 0;
    const assessmentScore = document.getElementById('assessmentScore');
    if (assessmentScore) {
        assessmentScore.innerHTML = `
            <span class="score-number">${overallScore.toFixed(1)}</span>
            <span class="score-label">综合评分</span>
        `;
    }

    const dimensionMap = {
        '准确性': 'accuracy', 'accuracy': 'accuracy',
        '流畅性': 'fluency', 'fluency': 'fluency',
        '文化适应性': 'cultural', 'cultural': 'cultural',
        '技术专业性': 'technical', 'technical': 'technical'
    };

    const scores = { accuracy: 0, fluency: 0, cultural: 0, technical: 0 };

    if (assessment.dimensions?.forEach) {
        assessment.dimensions.forEach(dim => {
            const key = dimensionMap[dim.name];
            if (key) scores[key] = dim.score;
        });
    } else if (assessment.dimensions) {
        Object.assign(scores, assessment.dimensions);
    }

    Object.keys(scores).forEach(key => {
        const fillElement = document.getElementById(`${key}Fill`);
        const scoreElement = document.getElementById(`${key}Score`);
        if (fillElement) fillElement.style.width = `${scores[key]}%`;
        if (scoreElement) scoreElement.textContent = scores[key].toFixed(1);
    });

    const reportSummary = document.getElementById('reportSummary');
    if (reportSummary) reportSummary.textContent = assessment.summary || '评估完成';

    const suggestionsList = document.getElementById('suggestionsList');
    if (suggestionsList) {
        const suggestions = assessment.suggestions || assessment.weaknesses || ['评估完成，翻译质量良好！'];
        suggestionsList.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
    }
}

function clearAssessment() {
    AppState.assessmentData = null;
    const assessmentScore = document.getElementById('assessmentScore');
    if (assessmentScore) {
        assessmentScore.innerHTML = `
            <span class="score-number">--</span>
            <span class="score-label">综合评分</span>
        `;
    }

    // 重置各维度显示
    ['accuracy', 'fluency', 'cultural', 'technical'].forEach(key => {
        const fillElement = document.getElementById(`${key}Fill`);
        const scoreElement = document.getElementById(`${key}Score`);
        if (fillElement) fillElement.style.width = '0%';
        if (scoreElement) scoreElement.textContent = '--';
    });

    const reportSummary = document.getElementById('reportSummary');
    const suggestionsList = document.getElementById('suggestionsList');
    if (reportSummary) reportSummary.textContent = '完成翻译后，系统将生成详细的评估报告...';
    if (suggestionsList) suggestionsList.innerHTML = '<li>请先进行翻译以获取评估建议</li>';
}

async function showReportModal() {
    if (!AppState.assessmentData) {
        alert('请先进行翻译评估');
        return;
    }

    const modal = document.getElementById('reportModal');
    const sourceText = document.getElementById('sourceText').value;
    const viewReportBtn = document.getElementById('viewReportBtn');

    // 显示加载状态
    if (viewReportBtn) {
        viewReportBtn.innerHTML = '<span class="loading-spinner-small"></span> 生成报告中...';
        viewReportBtn.disabled = true;
    }

    try {
        // 通过 TechAPI 调用后端
        const result = await window.TechAPI.callDetailedReport(sourceText, AppState.currentTranslation, AppState.assessmentData);

        // 后端返回结构: { report: "报告内容", suggestions: [], term_analysis: [] }
        const reportSummary = document.getElementById('modalReportSummary');
        if (reportSummary) {
            // 将 Markdown 格式的报告转换为 HTML 显示
            reportSummary.innerHTML = result.report?.replace(/\n/g, '<br>') || '暂无报告内容';
        }

        const suggestionsList = document.getElementById('modalSuggestionsList');
        if (suggestionsList) {
            suggestionsList.innerHTML = result.suggestions?.map(s => `<li>${s}</li>`).join('') || '<li>暂无建议</li>';
        }

        const termAnalysis = document.getElementById('termAnalysis');
        if (termAnalysis) {
            if (result.term_analysis && result.term_analysis.length > 0) {
                termAnalysis.innerHTML = result.term_analysis.map(t => `
                    <div class="term-analysis-item">
                        <div class="term-header">
                            <span class="term-cn">${t.term}</span>
                            <span class="term-arrow">→</span>
                            <span class="term-en">${t.translation}</span>
                            ${t.found_in_translation !== undefined ? `
                                <span class="term-status ${t.found_in_translation ? 'found' : 'missing'}">
                                    ${t.found_in_translation ? '✓ 已译' : '✗ 未译'}
                                </span>
                            ` : ''}
                        </div>
                        ${t.logic ? `<div class="term-logic">💡 ${t.logic}</div>` : ''}
                        ${t.analysis ? `<div class="term-desc">${t.analysis}</div>` : ''}
                    </div>
                `).join('');
            } else {
                termAnalysis.innerHTML = '<p class="placeholder-text">暂无术语分析数据</p>';
            }
        }

        modal.style.display = 'flex';
    } catch (error) {
        console.error('获取报告失败:', error);
        alert('生成报告失败，请重试');
    } finally {
        // 恢复按钮状态
        if (viewReportBtn) {
            viewReportBtn.innerHTML = '📋 查看详细报告';
            viewReportBtn.disabled = false;
        }
    }
}

async function exportReport() {
    if (!AppState.assessmentData) {
        alert('请先进行翻译评估');
        return;
    }

    const sourceText = document.getElementById('sourceText').value;
    const report = await window.TechAPI.callDetailedReport(sourceText, AppState.currentTranslation, AppState.assessmentData);

    const content = `
翻译评估报告
================
原文: ${sourceText}
译文: ${AppState.currentTranslation}
综合评分: ${AppState.assessmentData.overall_score}

评估总结: ${report.summary}

改进建议:
${report.suggestions?.map(s => '- ' + s).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `翻译评估报告_${new Date().toLocaleDateString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function saveResult() {
    if (!AppState.assessmentData) {
        alert('请先进行翻译评估');
        return;
    }

    const result = {
        source: document.getElementById('sourceText').value,
        translation: AppState.currentTranslation,
        assessment: AppState.assessmentData,
        timestamp: new Date().toISOString()
    };

    let saved = JSON.parse(localStorage.getItem('translationResults') || '[]');
    saved.push(result);
    localStorage.setItem('translationResults', JSON.stringify(saved));

    alert('结果已保存！');
}

// ===== 文件上传系统 =====
function initializeFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const termRecognizeBtn = document.getElementById('termRecognizeBtn');

    if (!uploadZone || !fileInput) return;

    uploadZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        if (e.dataTransfer.files) {
            Array.from(e.dataTransfer.files).forEach(handleFile);
        }
    });

    // 术语识别按钮
    if (termRecognizeBtn) {
        termRecognizeBtn.addEventListener('click', performTermRecognition);
    }
}

function handleFileSelect(e) {
    Array.from(e.target.files).forEach(handleFile);
}

function handleFile(file) {
    const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.docx')) {
        alert('不支持的文件格式，请上传 .txt, .pdf 或 .docx 文件');
        return;
    }

    if (file.size > maxSize) {
        alert('文件大小不能超过10MB');
        return;
    }

    AppState.uploadedFiles.push(file);
    displayUploadedFile(file);
}

function displayUploadedFile(file) {
    const uploadContent = document.getElementById('uploadContent');
    if (!uploadContent) return;

    // 根据文件类型选择表情符号
    const fileEmoji = getFileEmoji(file.name);

    // 替换上传区域内容为文件信息
    uploadContent.innerHTML = `
        <div class="file-display">
            <div class="file-emoji">${fileEmoji}</div>
            <div class="file-info">
                <p class="file-name">${file.name}</p>
                <p class="file-size">${formatFileSize(file.size)}</p>
            </div>
            <button class="file-remove" onclick="removeUploadedFile(event)" title="移除文件">×</button>
        </div>
    `;
}

function getFileEmoji(filename) {
    if (filename.endsWith('.docx')) return '📄';
    if (filename.endsWith('.pdf')) return '📕';
    if (filename.endsWith('.txt')) return '📝';
    return '📎';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeUploadedFile(event) {
    event.stopPropagation();

    // 清空上传的文件列表
    AppState.uploadedFiles = [];

    // 恢复上传区域的原始内容
    const uploadContent = document.getElementById('uploadContent');
    if (uploadContent) {
        uploadContent.innerHTML = `
            <div class="upload-icon">📁</div>
            <div class="upload-text">
                <p class="upload-main">拖拽文件到此处或点击上传</p>
                <p class="upload-sub">支持 .txt, .docx, .pdf 格式</p>
            </div>
        `;
    }
}

// ===== 术语识别功能 =====
async function performTermRecognition() {
    // 从AppState中获取已上传的文件
    const targetFile = AppState.uploadedFiles.find(f => f.name.endsWith('.docx'));

    if (!targetFile) {
        alert('请先上传 .docx 格式的文件');
        return;
    }

    // 显示加载状态
    const btn = document.getElementById('termRecognizeBtn');
    const originalText = btn.textContent;
    btn.textContent = '🔍 识别中...';
    btn.disabled = true;

    try {
        const result = await window.TechAPI.callTermRecognition(targetFile);
        showTermRecognitionModal(result);
    } catch (error) {
        console.error('术语识别失败:', error);
        alert('术语识别失败: ' + error.message);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

function showTermRecognitionModal(result) {
    // 创建或获取模态框
    let modal = document.getElementById('termRecognitionModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'termRecognitionModal';
        modal.className = 'term-recognition-modal';
        modal.innerHTML = `
            <div class="term-recognition-content">
                <div class="term-recognition-header">
                    <h3>📋 术语识别结果</h3>
                    <button class="close-btn" onclick="closeTermRecognitionModal()">&times;</button>
                </div>
                <div class="term-recognition-body" id="termRecognitionBody"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeTermRecognitionModal();
        });
    }

    // 填充内容
    const body = document.getElementById('termRecognitionBody');
    
    if (!result.recognized_terms || result.recognized_terms.length === 0) {
        body.innerHTML = `
            <div class="no-terms-found">
                <span>🔍</span>
                <p>未识别到术语</p>
                <p class="hint">文件中未找到数据库中存在的荔枝文化术语</p>
            </div>
        `;
    } else {
        body.innerHTML = `
            <div class="recognition-summary">
                <span class="file-name">📄 ${result.file_name}</span>
                <span class="term-count">识别到 ${result.total_terms} 个术语</span>
            </div>
            <div class="recognized-terms-list">
                ${result.recognized_terms.map((term, index) => `
                    <div class="recognized-term-item">
                        <div class="term-rank">${index + 1}</div>
                        <div class="term-info">
                            <div class="term-main">
                                <span class="term-cn">${term.term}</span>
                                <span class="term-divider">|</span>
                                <span class="term-en">${term.english_term || 'N/A'}</span>
                                <span class="term-count-badge">出现 ${term.count} 次</span>
                            </div>
                            <div class="term-category">${term.category || '未分类'}</div>
                            ${term.description ? `<div class="term-desc">${term.description}</div>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    modal.style.display = 'flex';
}

function closeTermRecognitionModal() {
    const modal = document.getElementById('termRecognitionModal');
    if (modal) modal.style.display = 'none';
}

// ===== 滚动系统 =====
function initializeScrollSystem() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
        scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== 工具函数 =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showTermModal(term) {
    const modal = document.getElementById('termDetailModal');
    if (!modal) return;

    document.getElementById('termDetailName').textContent = term.chinese_term || term.term || '未知术语';
    document.getElementById('termDetailCategory').textContent = term.category || '术语';
    document.getElementById('termDetailDescription').textContent = term.description || term.cultural_connotation || '暂无描述';

    modal.style.display = 'block';
}

function closeTermModal() {
    const modal = document.getElementById('termDetailModal');
    if (modal) modal.style.display = 'none';
}

function showTermDetail(termId) {
    // 先从allTerms中查找
    let term = AppState.allTerms.find(t => t.id === termId || t.term === termId);
    
    // 如果没找到，尝试从搜索结果中查找
    if (!term && AppState.lastSearchResults) {
        term = AppState.lastSearchResults.find(t => t.id === termId || t.chinese_term === termId || t.term === termId);
    }
    
    if (term) {
        showTermModal(term);
        // 添加到收藏
        addToCollection(term);
    } else {
        console.error('未找到术语:', termId);
    }
}

function addToCollection(term) {
    // 检查是否已收藏
    const exists = AppState.collectedTerms.find(t => 
        (t.id && t.id === term.id) || 
        (t.chinese_term && t.chinese_term === term.chinese_term) ||
        (t.term && t.term === term.term)
    );
    
    if (!exists) {
        AppState.collectedTerms.push(term);
        renderCollectedTerms();
    }
}

function removeFromCollection(index) {
    AppState.collectedTerms.splice(index, 1);
    renderCollectedTerms();
}

function renderCollectedTerms() {
    const container = document.getElementById('termsCollection');
    if (!container) return;

    if (AppState.collectedTerms.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>暂无收藏的术语</p>
                <p class="hint">搜索并选择术语进行收藏</p>
            </div>
        `;
        return;
    }

    container.innerHTML = AppState.collectedTerms.map((term, index) => `
        <div class="collected-term-card">
            <div class="collected-term-grid">
                <div class="collected-term-cell">
                    <span class="cell-label">中文</span>
                    <span class="cell-value cn">${escapeHtml(term.chinese_term || term.term)}</span>
                </div>
                <div class="collected-term-cell">
                    <span class="cell-label">English</span>
                    <span class="cell-value en">${escapeHtml(term.english_term || term.english || '-')}</span>
                </div>
                <div class="collected-term-cell">
                    <span class="cell-label">文化内涵</span>
                    <span class="cell-value desc">${escapeHtml(term.cultural_connotation || term.description || '-')}</span>
                </div>
                <div class="collected-term-cell">
                    <span class="cell-label">Cultural connotation</span>
                    <span class="cell-value desc-en">${escapeHtml(term.cultural_connotation_en || '-')}</span>
                </div>
            </div>
            <button class="remove-term-btn" onclick="removeFromCollection(${index})" title="移除">×</button>
        </div>
    `).join('');
}

function initializeDimensionCards() {
    // 初始化维度卡片系统
    const container = document.getElementById('cardsContainer');
    if (container) {
        container.innerHTML = `
            <div class="cards-empty">
                <span>📝</span>
                <p>请选择左侧维度标签查看数据</p>
            </div>
        `;
    }
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const termModal = document.getElementById('termModal');
    const reportModal = document.getElementById('reportModal');
    if (event.target === termModal) termModal.style.display = 'none';
    if (event.target === reportModal) reportModal.style.display = 'none';
};

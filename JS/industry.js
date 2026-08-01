// 广东农遗交易所 - 全屏滚动交互

// 全屏滚动管理
let currentSection = 1;
const totalSections = 4;
let isScrolling = false;

// 卡片数据 - 游戏化属性
const cardData = {
    zengcheng: {
        id: 'zengcheng',
        name: '增城荔枝',
        nameEn: 'Zengcheng Lychee',
        rarity: 'SSR',
        rarityClass: 'ssr',
        emoji: '🍒',
        tags: ['极速物流', '限时生存'],
        stats: [
            { label: '新鲜度', value: 95, color: 'red' },
            { label: '甜度', value: 92, color: 'red' },
            { label: '稀有度', value: 88, color: 'purple' }
        ],
        skills: [
            { icon: '⚡', name: '极速冷链', desc: '24小时内从枝头到舌尖，新鲜度损耗降低50%' },
            { icon: '📦', name: '限时生存', desc: '72小时黄金赏味期，超时自动触发降价机制' },
            { icon: '🎯', name: '精准配送', desc: 'GPS实时追踪，确保每一颗荔枝安全抵达' }
        ],
        bgImage: 'img/lychee-bg.jpg'
    },
    chaozhou: {
        id: 'chaozhou',
        name: '潮州单丛茶',
        nameEn: 'Chaozhou Dancong Tea',
        rarity: 'UR',
        rarityClass: 'ur',
        emoji: '🍵',
        tags: ['连击大师', '仪式感'],
        stats: [
            { label: '茶艺值', value: 98, color: 'green' },
            { label: '香气', value: 95, color: 'green' },
            { label: '回甘', value: 92, color: 'green' }
        ],
        skills: [
            { icon: '🎭', name: '功夫茶艺', desc: '21道工序连击，每完成一道攻击力+5' },
            { icon: '🌸', name: '蜜兰香韵', desc: '独特兰花香型，品饮后获得【心旷神怡】buff' },
            { icon: '🔥', name: '炭火淬炼', desc: '传统炭焙工艺，茶汤更加醇厚甘甜' }
        ],
        bgImage: 'img/tea-bg.jpg'
    },
    huazhou: {
        id: 'huazhou',
        name: '化州橘红',
        nameEn: 'Huazhou Huajuhong',
        rarity: 'SR',
        rarityClass: 'sr',
        emoji: '🍊',
        tags: ['治愈炼金', '岭南特供'],
        stats: [
            { label: '药效', value: 92, color: 'purple' },
            { label: '稀有度', value: 85, color: 'purple' },
            { label: '陈年潜力', value: 90, color: 'amber' }
        ],
        skills: [
            { icon: '⚗️', name: '炼金术士', desc: '可与其他药材合成，创造新的治愈配方' },
            { icon: '🫁', name: '润肺止咳', desc: '饮用后清除【咳嗽】debuff，恢复呼吸顺畅' },
            { icon: '👑', name: '明清贡品', desc: '皇室御用品质，自带尊贵光环加成' }
        ],
        bgImage: 'img/herb-bg.jpg'
    },
    xinhui: {
        id: 'xinhui',
        name: '新会陈皮',
        nameEn: 'Xinhui Dried Tangerine Peel',
        rarity: 'SSR',
        rarityClass: 'ssr',
        emoji: '🍊',
        tags: ['时间增值', '越老越强'],
        stats: [
            { label: '年份', value: 85, color: 'amber' },
            { label: '香气', value: 90, color: 'amber' },
            { label: '药效', value: 88, color: 'purple' }
        ],
        skills: [
            { icon: '⏳', name: '时间结晶', desc: '每存放一年，所有属性自动+2，无上限' },
            { icon: '🍵', name: '茶药双绝', desc: '既可泡茶养生，又可入药治病， versatility MAX' },
            { icon: '🏺', name: '陈香四溢', desc: '存放越久香气越醇厚，价值指数级增长' }
        ],
        bgImage: 'img/chenpi-bg.jpg'
    },
    dongguan: {
        id: 'dongguan',
        name: '东莞莞香',
        nameEn: 'Dongguan Incense',
        rarity: 'RARE',
        rarityClass: 'rare',
        emoji: '🌿',
        tags: ['创伤转化', '灵魂香氛'],
        stats: [
            { label: '香气', value: 88, color: 'green' },
            { label: '持久度', value: 95, color: 'amber' },
            { label: '稀有度', value: 90, color: 'purple' }
        ],
        skills: [
            { icon: '💎', name: '创伤转化', desc: '树木受伤后分泌树脂，痛苦转化为珍贵香料' },
            { icon: '🧘', name: '静心凝神', desc: '熏香时获得【冥想】状态，精神力恢复速度+30%' },
            { icon: '🎋', name: '香道传承', desc: '千年香道文化，品香即品历史' }
        ],
        bgImage: 'img/incense-bg.jpg'
    }
};

// 答题题库 - 按品种分类
const quizData = {
    zengcheng: [
        {
            question: '增城荔枝中最著名的品种是？',
            options: ['妃子笑', '桂味', '糯米糍', '黑叶'],
            correct: 1,
            exp: 35
        },
        {
            question: '增城荔枝的挂绿品种因何得名？',
            options: ['果实呈绿色', '果皮有绿色条纹', '树叶呈绿色', '树干呈绿色'],
            correct: 1,
            exp: 40
        },
        {
            question: '荔枝的最佳食用季节是？',
            options: ['春季', '夏季', '秋季', '冬季'],
            correct: 1,
            exp: 30
        },
        {
            question: '增城荔枝种植历史有多少年？',
            options: ['500年', '1000年', '2000年', '3000年'],
            correct: 2,
            exp: 45
        },
        {
            question: '荔枝属于什么科？',
            options: ['蔷薇科', '无患子科', '芸香科', '葫芦科'],
            correct: 1,
            exp: 35
        }
    ],
    chaozhou: [
        {
            question: '潮州单丛茶属于什么茶类？',
            options: ['绿茶', '红茶', '乌龙茶', '白茶'],
            correct: 2,
            exp: 35
        },
        {
            question: '"鸭屎香"是潮州单丛的什么？',
            options: ['品种名', '香型名', '工艺名', '地名'],
            correct: 1,
            exp: 40
        },
        {
            question: '冲泡单丛茶的最佳水温是？',
            options: ['60-70°C', '70-80°C', '80-90°C', '95-100°C'],
            correct: 3,
            exp: 35
        },
        {
            question: '潮州工夫茶一般使用几个杯子？',
            options: ['1个', '2个', '3个', '4个'],
            correct: 2,
            exp: 40
        },
        {
            question: '单丛茶的"山韵"指的是？',
            options: ['山的味道', '独特地域风味', '茶叶形状', '茶汤颜色'],
            correct: 1,
            exp: 45
        }
    ],
    huazhou: [
        {
            question: '化州橘红的主要功效是？',
            options: ['清热解毒', '理气化痰', '补血养颜', '安神助眠'],
            correct: 1,
            exp: 35
        },
        {
            question: '化州橘红表面的白色绒毛叫做？',
            options: ['橘红毛', '化州毛', '正毛', '绒毛'],
            correct: 2,
            exp: 40
        },
        {
            question: '化州橘红越陈越？',
            options: ['苦', '甜', '香', '酸'],
            correct: 2,
            exp: 35
        },
        {
            question: '化州橘红产自广东省哪个市？',
            options: ['广州市', '深圳市', '茂名市', '湛江市'],
            correct: 2,
            exp: 30
        },
        {
            question: '化州橘红属于什么科植物？',
            options: ['橘属', '柚属', '橙属', '柑属'],
            correct: 1,
            exp: 40
        }
    ],
    xinhui: [
        {
            question: '新会陈皮以什么柑橘皮制作最佳？',
            options: ['普通橘子', '茶枝柑', '柚子', '橙子'],
            correct: 1,
            exp: 35
        },
        {
            question: '新会陈皮"三瓣"是指？',
            options: ['三个品种', '三瓣形状', '三年陈化', '三个产地'],
            correct: 1,
            exp: 40
        },
        {
            question: '陈皮越陈越香，一般几年以上称为"陈皮"？',
            options: ['1年', '2年', '3年', '5年'],
            correct: 2,
            exp: 35
        },
        {
            question: '新会陈皮的核心产区"三江"是指？',
            options: ['梅江、天马、茶坑', '江门、珠海、中山', '东江、西江、北江', '长江、黄河、珠江'],
            correct: 0,
            exp: 45
        },
        {
            question: '陈皮的"陈化"是指？',
            options: ['晒干过程', '自然发酵氧化', '蒸煮过程', '腌制过程'],
            correct: 1,
            exp: 40
        }
    ],
    dongguan: [
        {
            question: '莞香是从什么树木中提取的？',
            options: ['檀香树', '沉香树', '樟树', '松树'],
            correct: 1,
            exp: 35
        },
        {
            question: '莞香的"结香"需要树木？',
            options: ['自然生长', '受伤感染', '嫁接繁殖', '施肥培育'],
            correct: 1,
            exp: 40
        },
        {
            question: '东莞莞香主要产自哪个镇？',
            options: ['虎门镇', '大岭山镇', '长安镇', '厚街镇'],
            correct: 1,
            exp: 35
        },
        {
            question: '莞香在古代主要用途是？',
            options: ['食用', '药用', '熏香', '染料'],
            correct: 2,
            exp: 35
        },
        {
            question: '莞香被评为国家地理标志产品是在？',
            options: ['2008年', '2010年', '2012年', '2014年'],
            correct: 3,
            exp: 45
        }
    ]
};

// 等级配置
const levelConfig = {
    maxLevel: 10,
    expPerLevel: 60,
    getLevelTitle: (level) => {
        const titles = ['新手', '学徒', '熟手', '能手', '高手', '达人', '专家', '大师', '宗师', '传奇', '神话'];
        return titles[level] || '神话';
    }
};

// 当前答题状态
let currentQuiz = null;
let currentQuizSlotIndex = -1;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initFullpageScroll();
    initNavigation();
    initCardInteractions();
});

// 全屏滚动实现
function initFullpageScroll() {
    const container = document.getElementById('fullscreenContainer');
    
    if (!container) return;
    
    // 鼠标滚轮事件
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    // 键盘事件
    document.addEventListener('keydown', handleKeyDown);
    
    // 触摸事件（移动端）
    let touchStartY = 0;
    container.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                scrollToSection(currentSection + 1);
            } else {
                scrollToSection(currentSection - 1);
            }
        }
    }, { passive: true });
}

// 处理滚轮事件
function handleWheel(e) {
    // 如果模态框打开，不处理滚动
    if (document.getElementById('cardModal').classList.contains('active')) {
        return;
    }
    
    e.preventDefault();
    
    if (isScrolling) return;
    
    const delta = e.deltaY;
    
    if (delta > 0) {
        scrollToSection(currentSection + 1);
    } else if (delta < 0) {
        scrollToSection(currentSection - 1);
    }
}

// 处理键盘事件
function handleKeyDown(e) {
    // ESC关闭模态框
    if (e.key === 'Escape') {
        closeCardModal();
        return;
    }
    
    // 如果模态框打开，不处理页面滚动
    if (document.getElementById('cardModal').classList.contains('active')) {
        return;
    }
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToSection(currentSection + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToSection(currentSection - 1);
    } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSection(1);
    } else if (e.key === 'End') {
        e.preventDefault();
        scrollToSection(totalSections);
    }
}

// 滚动到指定部分
function scrollToSection(sectionNum) {
    if (sectionNum < 1 || sectionNum > totalSections) return;
    if (isScrolling) return;
    
    isScrolling = true;
    currentSection = sectionNum;
    
    const targetSection = document.getElementById(`section${sectionNum}`);
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        updateNavigation();
    }
    
    // 防止连续滚动
    setTimeout(() => {
        isScrolling = false;
    }, 800);
}

// 初始化导航
function initNavigation() {
    const navDots = document.querySelectorAll('.nav-dot');
    
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const section = parseInt(dot.getAttribute('data-section'));
            scrollToSection(section);
        });
    });
}

// 更新导航状态
function updateNavigation() {
    const navDots = document.querySelectorAll('.nav-dot');
    
    navDots.forEach(dot => {
        const section = parseInt(dot.getAttribute('data-section'));
        if (section === currentSection) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// 卡片交互
function initCardInteractions() {
    const cards = document.querySelectorAll('.h-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // 卡片点击效果
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });
}

// 打开卡片模态框
function openCardModal(cardId) {
    const modal = document.getElementById('cardModal');
    const modalBody = document.getElementById('modalBody');
    const data = cardData[cardId];
    
    if (!data) return;
    
    // 生成模态框内容
    modalBody.innerHTML = `
        <div class="modal-card-header" style="justify-content: center; text-align: center;">
            <div class="modal-card-info">
                <div style="font-size: 4rem; margin-bottom: 16px;">${data.emoji}</div>
                <span class="modal-card-rarity ${data.rarityClass}">${data.rarity}</span>
                <h2 class="modal-card-name">${data.name}</h2>
                <p class="modal-card-name-en">${data.nameEn}</p>
                <div class="modal-card-tags" style="justify-content: center;">
                    ${data.tags.map(tag => `<span class="modal-card-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
        
        <div class="game-stats">
            <h4>⚔️ 属性</h4>
            ${data.stats.map(stat => `
                <div class="stat-row">
                    <span class="stat-label">${stat.label}</span>
                    <div class="stat-bar">
                        <div class="stat-fill ${stat.color}" style="width: ${stat.value}%"></div>
                    </div>
                    <span class="stat-value">${stat.value}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="card-skills">
            <h4>✨ 被动</h4>
            ${data.skills.map(skill => `
                <div class="skill-item">
                    <div class="skill-icon">${skill.icon}</div>
                    <div class="skill-content">
                        <h5>${skill.name}</h5>
                        <p>${skill.desc}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="modal-actions">
            <button class="modal-btn primary" onclick="startCultivation('${data.id}')">开始养成</button>
            <button class="modal-btn secondary" onclick="closeCardModal()">稍后再说</button>
        </div>
    `;
    
    // 显示模态框
    modal.classList.add('active');
    
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
}

// 关闭卡片模态框
function closeCardModal() {
    const modal = document.getElementById('cardModal');
    modal.classList.remove('active');
    
    // 恢复背景滚动
    document.body.style.overflow = '';
}

// 开始养成
function startCultivation(cardId) {
    closeCardModal();
    scrollToSection(2);
    console.log(`开始养成: ${cardId}`);
}

// 社交分享按钮
function shareToSocial(platform) {
    const shareText = "我在中国游戏里养的茶，寄到我家了！#GuangdongHeritage";
    const shareUrl = window.location.href;
    
    let shareLink = '';
    
    switch(platform) {
        case 'twitter':
            shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
            break;
        case 'facebook':
            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            break;
        default:
            // 复制到剪贴板
            navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
                alert('分享内容已复制到剪贴板！');
            });
            return;
    }
    
    if (shareLink) {
        window.open(shareLink, '_blank', 'width=600,height=400');
    }
}

// 为分享按钮添加事件监听
document.addEventListener('DOMContentLoaded', function() {
    const tiktokBtn = document.querySelector('.sp-btn.tiktok');
    const instagramBtn = document.querySelector('.sp-btn.instagram');
    const twitterBtn = document.querySelector('.sp-btn.twitter');
    
    if (tiktokBtn) {
        tiktokBtn.addEventListener('click', () => shareToSocial('tiktok'));
    }
    if (instagramBtn) {
        instagramBtn.addEventListener('click', () => shareToSocial('instagram'));
    }
    if (twitterBtn) {
        twitterBtn.addEventListener('click', () => shareToSocial('twitter'));
    }
});

// 滚动动画观察器
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            
            // 更新当前部分编号
            const sectionId = entry.target.id;
            const sectionNum = parseInt(sectionId.replace('section', ''));
            if (sectionNum && sectionNum !== currentSection) {
                currentSection = sectionNum;
                updateNavigation();
            }
        }
    });
}, observerOptions);

// 观察所有部分
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.fullscreen-section');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});

// ========== 农遗大厅功能 ==========

// 用户选择的槽位数据（最多4个）
let userSlots = [];
const MAX_SLOTS = 4;

// 产品数据
const productData = {
    'lychee-1': { name: '桂味荔枝', category: 'zengcheng', emoji: '🍒', price: '¥68/500g' },
    'lychee-2': { name: '糯米糍', category: 'zengcheng', emoji: '🍒', price: '¥88/500g' },
    'tea-1': { name: '鸭屎香', category: 'chaozhou', emoji: '🍵', price: '¥128/100g' },
    'tea-2': { name: '蜜兰香', category: 'chaozhou', emoji: '🍵', price: '¥98/100g' },
    'herb-1': { name: '正毛橘红', category: 'huazhou', emoji: '🍊', price: '¥168/50g' },
    'chenpi-1': { name: '五年陈皮', category: 'xinhui', emoji: '🍊', price: '¥268/100g' },
    'chenpi-2': { name: '十年陈皮', category: 'xinhui', emoji: '🍊', price: '¥688/100g' },
    'incense-1': { name: '莞香线香', category: 'dongguan', emoji: '🌿', price: '¥198/盒' }
};

// 初始化农遗大厅
document.addEventListener('DOMContentLoaded', function() {
    initHallFilters();
    initTrainSlots();
});

// 筛选功能
function initHallFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // 筛选卡片
            productCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('visible'), 10);
                } else {
                    card.classList.remove('visible');
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
    
    // 初始显示所有卡片
    productCards.forEach(card => card.classList.add('visible'));
}

// 添加产品到槽位
function addToSlot(productId, productName, category) {
    if (userSlots.length >= MAX_SLOTS) {
        alert('养成槽位已满！请先移除一些产品。');
        return;
    }
    
    // 检查是否已添加
    if (userSlots.some(slot => slot.id === productId)) {
        alert('该产品已在槽位中！');
        return;
    }
    
    const product = productData[productId];
    if (!product) return;
    
    userSlots.push({
        id: productId,
        name: product.name,
        category: category,
        emoji: product.emoji,
        price: product.price,
        level: 1,
        exp: 0,
        buffs: []
    });
    
    updateTrainSlots();
    updateCompletedSlots();
    
    // 添加成功动画
    const btn = event.target;
    btn.textContent = '✓ 已选择';
    btn.classList.add('added');
    setTimeout(() => {
        btn.textContent = '选择';
        btn.classList.remove('added');
    }, 1500);
}

// 从槽位移除产品
function removeFromSlot(index) {
    userSlots.splice(index, 1);
    
    // 如果移除的是当前选中的槽位，重置选中状态
    if (index === selectedSlotIndex) {
        selectedSlotIndex = -1;
        const mappingShowcase = document.getElementById('mappingShowcase');
        if (mappingShowcase) {
            mappingShowcase.innerHTML = `
                <div class="map-placeholder">
                    <div class="placeholder-icon">🔄</div>
                    <p>点击左侧槽位卡片</p>
                    <p class="placeholder-sub">查看数字藏品与实体产品的映射关系</p>
                </div>
            `;
        }
    } else if (index < selectedSlotIndex) {
        // 如果移除的槽位在选中槽位之前，调整选中索引
        selectedSlotIndex--;
    }
    
    updateTrainSlots();
    updateCompletedSlots();
}

// 前往养成部分
function goToTrainSection() {
    scrollToSection(3);
}

// ========== 养成系统功能 ==========

// 初始化养成槽位
function initTrainSlots() {
    updateTrainSlots();
    updateCompletedSlots();
}

// 更新养成槽位显示
function updateTrainSlots() {
    const trainSlots = document.getElementById('trainSlots');
    if (!trainSlots) return;
    
    // 更新槽位计数
    const slotCount = document.getElementById('slotCount');
    if (slotCount) {
        slotCount.textContent = `${userSlots.length}/${MAX_SLOTS}`;
    }
    
    if (userSlots.length === 0) {
        trainSlots.innerHTML = `
            <div class="empty-slots-message" style="grid-column: span 2;">
                <p>暂无养成中的产品</p>
                <button class="goto-hall-btn" onclick="scrollToSection(2)">前往农遗大厅选择产品</button>
            </div>
        `;
        // 重置映射状态
        const mapStatus = document.getElementById('mapStatus');
        if (mapStatus) {
            mapStatus.textContent = '未选择';
            mapStatus.classList.remove('active');
        }
        return;
    }
    
    trainSlots.innerHTML = userSlots.map((slot, index) => {
        const currentExp = slot.exp || 0;
        const expPercent = Math.min((currentExp / levelConfig.expPerLevel) * 100, 100);
        const isMaxLevel = slot.level >= 4; // 4级即可解锁产品名片
        const isTrueMaxLevel = slot.level >= levelConfig.maxLevel; // 真正满级10级
        
        return `
        <div class="train-slot-card ${index === selectedSlotIndex ? 'active' : ''} ${isMaxLevel ? 'unlocked' : ''}" data-slot-index="${index}" onclick="selectSlotForMapping(${index})">
            <div class="slot-card-header">
                <span class="slot-emoji">${slot.emoji}</span>
                <div class="slot-level-info">
                    <span class="slot-level">Lv.${slot.level}</span>
                    <span class="slot-title">${levelConfig.getLevelTitle(slot.level)}</span>
                </div>
            </div>
            <h4 class="slot-card-name">${slot.name}</h4>
            <div class="slot-exp-bar">
                <div class="exp-progress">
                    <div class="exp-fill" style="width: ${expPercent}%"></div>
                </div>
                <span class="exp-text">${isTrueMaxLevel ? 'MAX' : currentExp + '/' + levelConfig.expPerLevel}</span>
            </div>
            <div class="slot-card-buffs">
                ${slot.buffs.map(buff => `<span class="buff-tag">${buff}</span>`).join('') || '<span class="no-buff">暂无附魔</span>'}
            </div>
            <div class="slot-card-actions">
                <button class="action-btn quiz" onclick="event.stopPropagation(); openQuizModal(${index})" ${isTrueMaxLevel ? 'disabled' : ''}>
                    ${isTrueMaxLevel ? '已满级' : '答题升级'}
                </button>
                <button class="action-btn remove" onclick="event.stopPropagation(); removeFromSlot(${index})">移除</button>
            </div>
        </div>
    `}).join('');
}

// 当前选中的槽位索引
let selectedSlotIndex = -1;

// 选择槽位查看虚实映射
function selectSlotForMapping(index) {
    const slot = userSlots[index];
    if (!slot) return;
    
    // 更新选中状态
    selectedSlotIndex = index;
    document.querySelectorAll('.train-slot-card').forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
    
    // 更新映射状态标签
    const mapStatus = document.getElementById('mapStatus');
    if (mapStatus) {
        mapStatus.textContent = '已连接';
        mapStatus.classList.add('active');
    }
    
    const mappingShowcase = document.getElementById('mappingShowcase');
    if (!mappingShowcase) return;
    
    const categoryNames = {
        zengcheng: '增城荔枝',
        chaozhou: '潮州单丛茶',
        huazhou: '化州橘红',
        xinhui: '新会陈皮',
        dongguan: '东莞莞香'
    };
    
    mappingShowcase.innerHTML = `
        <div class="mapping-display">
            <div class="map-card digital">
                <div class="map-header">
                    <span class="map-label">数字端</span>
                </div>
                <div class="map-content">
                    <div class="nft-display">
                        <div class="nft-card">
                            <div class="nft-shine"></div>
                            <div class="nft-emoji">${slot.emoji}</div>
                            <h4>${slot.name}</h4>
                            <p class="nft-id">ID: GD-${slot.category.toUpperCase()}-${String(index + 1).padStart(3, '0')}</p>
                            <div class="nft-attrs">
                                <span class="nft-attr">Lv.${slot.level}</span>
                                ${slot.buffs.map(buff => `<span class="nft-attr">${buff}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="map-connector">
                <div class="connector-line"></div>
                <div class="connector-icon">⇄</div>
            </div>
            
            <div class="map-card physical">
                <div class="map-header">
                    <span class="map-label">实体端</span>
                </div>
                <div class="map-content">
                    <div class="farmer-info">
                        <div class="farmer-avatar">👨‍🌾</div>
                        <div class="farmer-detail">
                            <p class="farmer-name">${categoryNames[slot.category]}传承人</p>
                            <p class="farmer-loc">📍 广东·${categoryNames[slot.category].substring(0, 2)}</p>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-img" style="background: linear-gradient(135deg, #B4322F, #C77E2A);">${slot.emoji}</div>
                        <div class="product-detail">
                            <h5>${slot.name}</h5>
                            <p class="product-price">${slot.price}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 打开附魔模态框
function openEnchantModal(slotIndex) {
    if (slotIndex === undefined) {
        // 如果没有指定槽位，选择第一个
        if (userSlots.length === 0) {
            alert('请先添加产品到槽位！');
            return;
        }
        slotIndex = 0;
    }
    
    const slot = userSlots[slotIndex];
    if (!slot) return;
    
    // 这里可以打开一个模态框显示附魔选项
    alert(`为 ${slot.name} 附魔功能开发中...\n\n可选择附魔：\n⚡ 极速生长 - 成熟时间-20%\n🛡️ 天气护盾 - 抵御自然灾害\n✨ 品质提升 - 最终品质+1`);
}

// 查看天气
function checkWeather() {
    alert('实时天气功能开发中...\n\n当前广东天气：\n🌤️ 晴朗 25°C\n适宜农作物生长！');
}

// 每日签到
function dailyCheckIn() {
    const today = new Date().toDateString();
    const lastCheckIn = localStorage.getItem('lastCheckIn');
    
    if (lastCheckIn === today) {
        alert('今日已签到！明天再来吧~');
        return;
    }
    
    localStorage.setItem('lastCheckIn', today);
    
    // 为所有槽位产品增加经验
    userSlots.forEach(slot => {
        addExpToSlot(slot, 50);
    });
    
    updateTrainSlots();
    alert('签到成功！\n\n所有养成中的产品获得50点经验值！');
}

// ========== 答题升级系统 ==========

// 打开答题模态框
function openQuizModal(slotIndex) {
    if (slotIndex === undefined) {
        if (userSlots.length === 0) {
            alert('请先添加产品到槽位！');
            return;
        }
        slotIndex = selectedSlotIndex >= 0 ? selectedSlotIndex : 0;
    }
    
    const slot = userSlots[slotIndex];
    if (!slot) return;
    
    // 检查是否已满级（10级）
    if (slot.level >= levelConfig.maxLevel) {
        alert('该产品已达到最高等级！');
        return;
    }
    
    currentQuizSlotIndex = slotIndex;
    
    // 随机获取该品种的一道题目
    const questions = quizData[slot.category];
    if (!questions || questions.length === 0) {
        alert('该品种暂无题目，敬请期待！');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * questions.length);
    currentQuiz = questions[randomIndex];
    
    renderQuizModal(slot, currentQuiz);
}

// 渲染答题模态框
function renderQuizModal(slot, quiz) {
    // 移除已存在的模态框
    const existingModal = document.getElementById('quizModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'quizModal';
    modal.className = 'quiz-modal';
    modal.innerHTML = `
        <div class="quiz-modal-content">
            <div class="quiz-header">
                <div class="quiz-product-info">
                    <span class="quiz-emoji">${slot.emoji}</span>
                    <div class="quiz-product-detail">
                        <h3>${slot.name}</h3>
                        <span class="quiz-level">Lv.${slot.level} ${levelConfig.getLevelTitle(slot.level)}</span>
                    </div>
                </div>
                <button class="quiz-close" onclick="closeQuizModal()">×</button>
            </div>
            <div class="quiz-body">
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(slot.exp || 0) % levelConfig.expPerLevel}%"></div>
                    </div>
                    <span class="progress-text">${slot.exp || 0}/${levelConfig.expPerLevel} EXP</span>
                </div>
                <div class="quiz-question">
                    <span class="question-tag">知识问答</span>
                    <p class="question-text">${quiz.question}</p>
                </div>
                <div class="quiz-options">
                    ${quiz.options.map((option, index) => `
                        <button class="quiz-option" data-index="${index}" onclick="selectQuizAnswer(${index})">
                            <span class="option-label">${String.fromCharCode(65 + index)}</span>
                            <span class="option-text">${option}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="quiz-footer">
                <p class="quiz-hint">💡 答对可获得 ${quiz.exp} 点经验值</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 动画显示
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
}

// 选择答案
function selectQuizAnswer(answerIndex) {
    if (!currentQuiz) return;
    
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.disabled = true);
    
    const selectedOption = options[answerIndex];
    const correctOption = options[currentQuiz.correct];
    
    if (answerIndex === currentQuiz.correct) {
        // 答对
        selectedOption.classList.add('correct');
        
        // 添加经验值
        const slot = userSlots[currentQuizSlotIndex];
        if (slot) {
            const leveledUp = addExpToSlot(slot, currentQuiz.exp);
            updateTrainSlots();
            
            setTimeout(() => {
                if (leveledUp) {
                    showQuizResult(true, `回答正确！\n\n获得 ${currentQuiz.exp} 点经验值\n🎉 恭喜升级到 Lv.${slot.level}！`);
                } else {
                    showQuizResult(true, `回答正确！\n\n获得 ${currentQuiz.exp} 点经验值`);
                }
            }, 500);
        }
    } else {
        // 答错
        selectedOption.classList.add('wrong');
        correctOption.classList.add('correct');
        
        setTimeout(() => {
            showQuizResult(false, '回答错误！\n\n正确答案是：' + currentQuiz.options[currentQuiz.correct]);
        }, 500);
    }
}

// 显示答题结果
function showQuizResult(isCorrect, message) {
    const modalContent = document.querySelector('.quiz-modal-content');
    if (!modalContent) return;
    
    modalContent.innerHTML += `
        <div class="quiz-result ${isCorrect ? 'success' : 'fail'}">
            <div class="result-icon">${isCorrect ? '🎉' : '😅'}</div>
            <p class="result-message">${message.replace(/\n/g, '<br>')}</p>
            <button class="result-btn" onclick="${isCorrect ? 'closeQuizModal()' : 'retryQuiz()'}">
                ${isCorrect ? '确定' : '再试一次'}
            </button>
        </div>
    `;
}

// 重试答题
function retryQuiz() {
    if (currentQuizSlotIndex >= 0) {
        openQuizModal(currentQuizSlotIndex);
    }
}

// 关闭答题模态框
function closeQuizModal() {
    const modal = document.getElementById('quizModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
    currentQuiz = null;
    currentQuizSlotIndex = -1;
}

// 添加经验值到槽位
function addExpToSlot(slot, exp) {
    if (!slot.exp) slot.exp = 0;
    if (!slot.level) slot.level = 1;
    
    slot.exp += exp;
    
    let leveledUp = false;
    
    // 检查升级
    while (slot.exp >= levelConfig.expPerLevel && slot.level < levelConfig.maxLevel) {
        slot.exp -= levelConfig.expPerLevel;
        slot.level++;
        leveledUp = true;
        
        // 升级奖励：随机获得一个buff
        const buffs = ['⚡ 快速成长', '🛡️ 天气护盾', '✨ 品质提升', '🌟 幸运加成'];
        const randomBuff = buffs[Math.floor(Math.random() * buffs.length)];
        if (!slot.buffs.includes(randomBuff)) {
            slot.buffs.push(randomBuff);
        }
    }
    
    // 如果满级，经验值保持在最大值
    if (slot.level >= levelConfig.maxLevel) {
        slot.exp = levelConfig.expPerLevel;
    }
    
    // 更新已完成槽位显示
    updateCompletedSlots();
    
    return leveledUp;
}

// ========== 产品名片与故事系统 ==========

// 用户故事数据存储
let userStories = JSON.parse(localStorage.getItem('heritageStories')) || {};

// 打开产品名片模态框
function openProductCardModal() {
    // 获取第一个达到4级的产品（4级即可解锁产品名片）
    const completedSlot = userSlots.find(slot => slot.level >= 4);
    
    const modal = document.createElement('div');
    modal.id = 'productCardModal';
    modal.className = 'product-card-modal';
    
    if (completedSlot) {
        const story = userStories[completedSlot.id] || '';
        const categoryNames = {
            zengcheng: '增城荔枝',
            chaozhou: '潮州单丛茶',
            huazhou: '化州橘红',
            xinhui: '新会陈皮',
            dongguan: '东莞莞香'
        };
        
        modal.innerHTML = `
            <div class="product-card-modal-content">
                <button class="pc-modal-close" onclick="closeProductCardModal()">×</button>
                
                <!-- 名片正面 -->
                <div class="product-card-front">
                    <div class="pc-shine"></div>
                    <div class="pc-header">
                        <div class="pc-rarity">${completedSlot.level >= 10 ? 'LEGENDARY' : completedSlot.level >= 7 ? 'EPIC' : 'RARE'}</div>
                        <div class="pc-date">${new Date().toLocaleDateString('zh-CN')}</div>
                    </div>
                    
                    <div class="pc-main">
                        <div class="pc-emoji">${completedSlot.emoji}</div>
                        <div class="pc-info">
                            <h2 class="pc-name">${completedSlot.name}</h2>
                            <p class="pc-category">${categoryNames[completedSlot.category]}</p>
                            
                            <div class="pc-stats">
                                <div class="pc-stat">
                                    <span class="stat-label">等级</span>
                                    <span class="stat-value">Lv.${completedSlot.level}</span>
                                </div>
                                <div class="pc-stat">
                                    <span class="stat-label">称号</span>
                                    <span class="stat-value">${levelConfig.getLevelTitle(completedSlot.level)}</span>
                                </div>
                                <div class="pc-stat">
                                    <span class="stat-label">附魔</span>
                                    <span class="stat-value">${completedSlot.buffs.length}</span>
                                </div>
                            </div>
                            
                            <div class="pc-buffs">
                                ${completedSlot.buffs.map(buff => `<span class="pc-buff">${buff}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="pc-footer">
                        <div class="pc-id">ID: GD-${completedSlot.category.toUpperCase()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}</div>
                        <div class="pc-chain">🔒 区块链已存证</div>
                    </div>
                </div>
                
                <!-- 故事区域 -->
                <div class="story-section">
                    <h3 class="story-title">
                        <span class="story-icon">✨</span>
                        你与它的故事
                    </h3>
                    <textarea 
                        class="story-input" 
                        id="storyInput" 
                        placeholder="记录你与这个农遗产品的独特故事...&#10;例如：你是如何养成它的？它对你有什么特殊意义？"
                        maxlength="500"
                    >${story}</textarea>
                    <div class="story-actions">
                        <span class="story-count" id="storyCount">${story.length}/500</span>
                        <button class="story-save-btn" onclick="saveStory('${completedSlot.id}')">
                            <span>💾</span> 保存故事
                        </button>
                    </div>
                </div>
                
                <!-- 成就徽章 -->
                <div class="achievements-section">
                    <h3 class="achievements-title">🏆 获得成就</h3>
                    <div class="achievement-badges">
                        <div class="badge" title="首次养成">
                            <span class="badge-icon">🌱</span>
                            <span class="badge-name">初出茅庐</span>
                        </div>
                        <div class="badge ${completedSlot.level >= 5 ? 'earned' : 'locked'}" title="达到5级">
                            <span class="badge-icon">🌿</span>
                            <span class="badge-name">茁壮成长</span>
                        </div>
                        <div class="badge ${completedSlot.level >= 10 ? 'earned' : 'locked'}" title="达到10级">
                            <span class="badge-icon">🌳</span>
                            <span class="badge-name">参天大树</span>
                        </div>
                        <div class="badge ${completedSlot.buffs.length >= 3 ? 'earned' : 'locked'}" title="获得3个附魔">
                            <span class="badge-icon">✨</span>
                            <span class="badge-name">附魔大师</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加输入监听
        setTimeout(() => {
            const input = document.getElementById('storyInput');
            const count = document.getElementById('storyCount');
            if (input && count) {
                input.addEventListener('input', () => {
                    count.textContent = `${input.value.length}/500`;
                });
            }
        }, 100);
    } else {
        // 没有完成的产品时显示提示
        modal.innerHTML = `
            <div class="product-card-modal-content empty">
                <button class="pc-modal-close" onclick="closeProductCardModal()">×</button>
                <div class="empty-state">
                    <div class="empty-icon">📦</div>
                    <h3>暂无可查看的产品名片</h3>
                    <p>在第三部分将产品养成至 Lv.4 后<br>即可解锁专属产品名片</p>
                    <button class="goto-train-btn" onclick="closeProductCardModal(); scrollToSection(3);">
                        去养成产品
                    </button>
                </div>
            </div>
        `;
    }
    
    document.body.appendChild(modal);
    
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
}

// 关闭产品名片模态框
function closeProductCardModal() {
    const modal = document.getElementById('productCardModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// 保存故事
function saveStory(productId) {
    const input = document.getElementById('storyInput');
    if (!input) return;
    
    const story = input.value.trim();
    userStories[productId] = story;
    localStorage.setItem('heritageStories', JSON.stringify(userStories));
    
    // 显示保存成功提示
    const btn = document.querySelector('.story-save-btn');
    if (btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>✅</span> 已保存';
        btn.classList.add('saved');
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('saved');
        }, 2000);
    }
}

// 分享到社交平台
function shareToSocial(platform) {
    const messages = {
        tiktok: '我在广东农遗养成游戏中获得了传说级产品！#GuangdongHeritage #AgriCulture',
        instagram: 'Just got my legendary heritage product! 🌟 #GuangdongHeritage #DigitalFarming',
        twitter: 'Leveled up my Guangdong heritage product to max! 🎮🌾 #GuangdongHeritage',
        wechat: '我在广东农遗养成游戏中获得了传说级产品，快来一起体验吧！'
    };
    
    const message = messages[platform] || messages.wechat;
    
    // 复制到剪贴板
    navigator.clipboard.writeText(message).then(() => {
        alert(`分享内容已复制到剪贴板！\n\n${message}`);
    }).catch(() => {
        alert(`分享内容：\n${message}`);
    });
}

// 更新第四部分已完成的槽位显示
function updateCompletedSlots() {
    const container = document.getElementById('completedSlots');
    if (!container) return;
    
    // 4级及以上即可显示在已完成列表
    const completedSlots = userSlots.filter(slot => slot.level >= 4);
    
    if (completedSlots.length === 0) {
        container.innerHTML = `
            <div class="empty-completed">
                <p>暂无可实体化的产品</p>
                <p class="sub-text">在第三部分将产品养成至 Lv.4 后即可解锁产品名片</p>
            </div>
        `;
        return;
    }
    
    const categoryNames = {
        zengcheng: '增城荔枝',
        chaozhou: '潮州单丛茶',
        huazhou: '化州橘红',
        xinhui: '新会陈皮',
        dongguan: '东莞莞香'
    };
    
    container.innerHTML = completedSlots.map(slot => `
        <div class="completed-slot-card" onclick="openProductCardModal()">
            <div class="completed-emoji">${slot.emoji}</div>
            <div class="completed-info">
                <h4>${slot.name}</h4>
                <p>${categoryNames[slot.category]}</p>
                <span class="completed-badge">${slot.level >= 10 ? '🏆 已满级' : '✨ Lv.' + slot.level}</span>
            </div>
            <div class="completed-arrow">→</div>
        </div>
    `).join('');
}

// 主页核心功能 - 精简版

// 滚动指示器
const sections = document.querySelectorAll('.section');
const scrollDots = document.querySelectorAll('.scroll-dot');
const container = document.querySelector('.container');

// 更新滚动指示器
function updateScrollIndicator() {
    const scrollPosition = container.scrollTop;
    const windowHeight = window.innerHeight;
    const currentSection = Math.round(scrollPosition / windowHeight) + 1;

    scrollDots.forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === currentSection);
    });
}

// 滚动指示器点击事件
scrollDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const sectionNumber = dot.getAttribute('data-section');
        const targetSection = document.getElementById(`section${sectionNumber}`);
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// 监听滚动事件
container.addEventListener('scroll', updateScrollIndicator);

// 鼠标滚轮平滑滚动
let isScrolling = false;
container.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    
    isScrolling = true;
    e.preventDefault();
    
    const scrollAmount = window.innerHeight;
    container.scrollBy({
        top: e.deltaY > 0 ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
    });
    
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
});

// 触摸滑动支持
let touchStartY = 0;
container.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

container.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].screenY;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > 50) {
        container.scrollBy({
            top: diff > 0 ? window.innerHeight : -window.innerHeight,
            behavior: 'smooth'
        });
    }
});

// 卡片悬停效果
const glassCard = document.querySelector('.glass-card');
document.addEventListener('mousemove', (e) => {
    if (!glassCard) return;
    
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    glassCard.style.transform = `translateY(-10px) translateX(${x}px) translateY(${y}px)`;
});

document.addEventListener('mouseleave', () => {
    if (glassCard) {
        glassCard.style.transform = 'translateY(0) translateX(0) translateY(0)';
    }
});

// 共创社区 - 荔枝文化评价墙
const storyWall = document.getElementById('storyWall');

// 当前选中的标签
let currentTab = 'chinese';

// 中国专家数据 - 广东省各地农遗
const chineseExperts = [
    {
        name: "陈建国",
        role: "农业遗产研究者",
        avatar: "陈",
        location: "📍 广州增城",
        content: "研究岭南农业文化遗产二十余年，从增城荔枝到潮州工夫茶，从顺德桑基鱼塘到梅州客家土楼，广东的每一处农遗都承载着独特的生态智慧。这些传统农业系统不仅是生产方式，更是人与自然和谐共生的典范。",
        insight: "农业文化遗产的保护需要跨学科、跨区域的协同合作，建立全省统一的保护标准和监测体系。",
        date: "2024-03-15"
    },
    {
        name: "林茶芳",
        role: "茶农",
        avatar: "林",
        location: "📍 潮州凤凰山",
        content: "我家四代种茶，从宋种到单丛，每一片茶叶都凝聚着祖辈的心血。凤凰山的云雾滋养了独特的茶树，而我们的工夫茶艺更是将茶的精髓发挥到极致。采青、晒青、做青、杀青、揉捻、烘焙，每一步都不能马虎。",
        insight: "潮州工夫茶不仅是泡茶技艺，更是一种生活美学。年轻人学习茶艺，是在传承一种优雅的生活态度。",
        date: "2024-03-12"
    },
    {
        name: "王志强",
        role: "非遗经纪人",
        avatar: "王",
        location: "📍 佛山顺德",
        content: "从事非遗产品推广十年，见证了顺德桑基鱼塘从传统农业向生态旅游的转型。桑基鱼塘不仅是养鱼种桑的模式，更是一种循环利用的生态智慧。现在我们还开发了香云纱、桑果酒等衍生产品，让古老技艺焕发新生。",
        insight: "农遗产业化要守住生态底线，不能为了经济利益破坏原有的生态系统。可持续发展才是真正的传承。",
        date: "2024-03-10"
    },
    {
        name: "张雅琴",
        role: "文化人类学者",
        avatar: "张",
        location: "📍 广州",
        content: "从人类学视角研究广东农遗十年，发现这些传统农业系统深深植根于地方社会结构。无论是化州的化橘红、新会的陈皮，还是梅州客家山歌与土楼的共生关系，都体现了地方知识与生态环境的深度融合。",
        insight: "农遗保护的核心是人，要关注传承人的生计保障和社会地位，让他们有尊严地传承技艺。",
        date: "2024-03-08"
    },
    {
        name: "黄国栋",
        role: "土楼营造技艺传承人",
        avatar: "黄",
        location: "📍 梅州大埔",
        content: "营造土楼是客家祖先留下的宝贵技艺。从选址、夯土到封顶，每一道工序都有讲究。我们用的三合土要反复捶打，墙体要逐层收缩，这样建出来的土楼才能历经数百年风雨不倒。花萼楼、泰安楼都是我们的骄傲。",
        insight: "土楼营造不仅是建筑技艺，更体现了客家人聚族而居、守望相助的文化传统。这种社区精神值得传承。",
        date: "2024-03-05"
    },
    {
        name: "赵明华",
        role: "陈皮产业企业家",
        avatar: "赵",
        location: "📍 江门新会",
        content: "经营新会陈皮产业十五年，从传统晾晒到现代仓储，我们始终坚持'三年陈、五年香、十年宝'的标准。新会的茶枝柑、古井的水土，造就了独一无二的陈皮品质。现在我们的产品远销海外，让更多人了解岭南药膳文化。",
        insight: "道地药材的核心是产地环境，保护新会的生态环境就是保护陈皮产业的根基。",
        date: "2024-03-01"
    }
];

// 国际友人数据 - 广东省农遗视角
const internationalFriends = [
    {
        name: "Sarah Johnson",
        country: "🇺🇸 USA",
        avatar: "S",
        role: "Cultural Anthropologist",
        content: "Guangdong's agricultural heritage represents a remarkable diversity of living traditions. From the lychee orchards of Zengcheng to the tea gardens of Chaozhou, from the mulberry-fish ponds of Shunde to the tulou buildings of Meizhou, each region has developed unique ecological knowledge systems adapted to local conditions.",
        insight: "What's particularly fascinating is how these agricultural systems are deeply embedded in social structures and cultural practices. The Hakka tulou, for instance, represents not just architectural ingenuity but also communal living traditions that sustained these communities for centuries.",
        date: "2024-03-15"
    },
    {
        name: "Pierre Dubois",
        country: "🇫🇷 France",
        avatar: "P",
        role: "Chef & Food Critic",
        content: "As a Michelin-starred chef, I've had the privilege of tasting exceptional ingredients from Guangdong. The 'Gualv' lychee from Zengcheng, the Phoenix Dancong tea from Chaozhou, and the dried tangerine peel from Xinhui each possess unique terroir characteristics that reflect centuries of cultivation wisdom.",
        insight: "French gastronomy places immense value on 'terroir' - the sense of place that gives products their distinctive character. Guangdong's agricultural products deserve protected designation of origin status, similar to our Champagne or Roquefort, to preserve their authenticity and support local producers.",
        date: "2024-03-12"
    },
    {
        name: "Akira Tanaka",
        country: "🇯🇵 Japan",
        avatar: "A",
        role: "Agricultural Systems Researcher",
        content: "Japan has long admired Chinese agricultural wisdom. The ecological balance in Guangdong's traditional systems - whether it's the mulberry-fish pond symbiosis in Shunde or the organic tea cultivation in Phoenix Mountain - demonstrates sophisticated understanding of sustainable agriculture that predates modern ecological science.",
        insight: "The Chaozhou Gongfu tea ceremony reminds me of our Japanese tea traditions, but with its own distinct philosophical approach. These rituals connect agriculture with spirituality and aesthetics, creating holistic cultural experiences that transcend mere commodity production.",
        date: "2024-03-10"
    },
    {
        name: "Marco Rodriguez",
        country: "🇪🇸 Spain",
        avatar: "M",
        role: "Sustainable Agriculture Consultant",
        content: "Spain's agricultural regions face similar challenges to Guangdong - balancing tradition with modernization while preserving ecological integrity. What impressed me most was the innovative approaches in Shunde, where traditional mulberry-fish ponds have evolved into eco-tourism destinations while maintaining their core ecological functions.",
        insight: "The cooperative models I've observed across Guangdong, where knowledge and resources are shared while maintaining family-based production units, offer valuable lessons for Mediterranean agriculture. These hybrid systems could inform our approach to sustainable farming in Valencia and Andalusia.",
        date: "2024-03-08"
    },
    {
        name: "Emma Thompson",
        country: "🇬🇧 UK",
        avatar: "E",
        role: "Heritage Conservation Specialist",
        content: "Working with UNESCO and heritage institutions worldwide, I've encountered many agricultural heritage sites, but Guangdong's diversity is exceptional. The province encompasses multiple GIAHS (Globally Important Agricultural Heritage Systems) including the Shunde mulberry-fish ponds and numerous traditional knowledge systems.",
        insight: "I'm particularly concerned about the preservation of genetic diversity in traditional crop varieties - from ancient lychee cultivars to heritage tea plants. These represent irreplaceable genetic resources that could prove crucial for future food security and climate adaptation.",
        date: "2024-03-05"
    },
    {
        name: "Hans Mueller",
        country: "🇩🇪 Germany",
        avatar: "H",
        role: "Organic Certification Expert",
        content: "Germany maintains some of the world's strictest organic standards. Examining Guangdong's traditional agricultural practices, I was impressed to find that many already meet or exceed EU organic requirements - natural pest management, composting systems, biodiversity conservation, and zero synthetic inputs.",
        insight: "The traditional processing methods for products like Xinhui dried tangerine peel and Huazhou Huajuhong demonstrate how ancient techniques can align with modern quality standards. There's significant potential for these products in European organic and specialty markets if certification pathways can be established.",
        date: "2024-03-01"
    }
];

// 生成评价卡片
function generateUserCards() {
    if (!storyWall) return;
    
    storyWall.innerHTML = '';
    
    const data = currentTab === 'chinese' ? chineseExperts : internationalFriends;
    
    data.forEach((person, index) => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        if (currentTab === 'chinese') {
            // 中国专家卡片
            card.innerHTML = `
                <div class="user-header">
                    <div class="user-avatar">${person.avatar}</div>
                    <div class="user-info">
                        <div class="user-name">${person.name}</div>
                        <div class="user-role">${person.role} · ${person.location}</div>
                    </div>
                </div>
                <div class="user-content">
                    <div class="content-label">📝 分享</div>
                    <div class="content-text">${person.content}</div>
                </div>
                <div class="user-insight">
                    <div class="insight-label">💡 见解</div>
                    <div class="insight-text">${person.insight}</div>
                </div>
                <div class="evaluation-date">${person.date}</div>
            `;
        } else {
            // 国际友人卡片
            card.innerHTML = `
                <div class="user-header">
                    <div class="user-avatar">${person.avatar}</div>
                    <div class="user-info">
                        <div class="user-name">${person.name}</div>
                        <div class="user-role">${person.role}</div>
                        <div class="user-country">${person.country}</div>
                    </div>
                </div>
                <div class="user-content">
                    <div class="content-label">📝 Story</div>
                    <div class="content-text">${person.content}</div>
                </div>
                <div class="user-insight">
                    <div class="insight-label">💡 Insight</div>
                    <div class="insight-text">${person.insight}</div>
                </div>
                <div class="evaluation-date">${person.date}</div>
            `;
        }
        
        // 添加点击事件
        card.addEventListener('click', () => {
            showPersonDetails(person);
        });
        
        storyWall.appendChild(card);
    });
}

// 切换标签
function initCommunityTabs() {
    const tabBtns = document.querySelectorAll('.community-tabs .tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有active状态
            tabBtns.forEach(b => b.classList.remove('active'));
            // 添加当前active状态
            btn.classList.add('active');
            // 更新当前标签
            currentTab = btn.getAttribute('data-tab');
            // 重新生成卡片
            generateUserCards();
        });
    });
}

// 显示详情 - 学术风模态框
function showPersonDetails(person) {
    const isChinese = currentTab === 'chinese';
    const modal = document.createElement('div');
    modal.className = 'academic-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(28, 21, 16, 0.85);
        backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    const headerInfo = isChinese 
        ? `<p style="margin: 0; font-size: 0.95rem; color: #77685A; font-weight: 500;">${person.role} · ${person.location}</p>`
        : `<p style="margin: 0; font-size: 0.95rem; color: #77685A; font-weight: 500;">${person.role}</p>
           <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #A39680;">${person.country}</p>`;
    
    modal.innerHTML = `
        <div class="academic-modal-content" style="
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
            border-radius: 16px;
            padding: 40px;
            max-width: 700px;
            width: 90%;
            max-height: 85vh;
            overflow-y: auto;
            position: relative;
            animation: slideUp 0.3s ease;
            border: 1px solid rgba(67, 51, 42, 0.15);
            box-shadow: 0 25px 50px -12px rgba(67, 51, 42, 0.25);
        ">
            <!-- 学术风格装饰线 -->
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #43332A 0%, #B4322F 50%, #d97706 100%);
                border-radius: 16px 16px 0 0;
            "></div>
            
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(67, 51, 42, 0.1);
                border: 1px solid rgba(67, 51, 42, 0.2);
                border-radius: 8px;
                width: 36px;
                height: 36px;
                color: #43332A;
                font-size: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(67, 51, 42, 0.2)'" onmouseout="this.style.background='rgba(67, 51, 42, 0.1)'">×</button>
            
            <!-- 头部信息 -->
            <div style="text-align: center; margin-bottom: 30px; padding-top: 10px;">
                <div style="
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #43332A 0%, #B4322F 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 1.8rem;
                    margin: 0 auto 15px;
                    border: 3px solid rgba(67, 51, 42, 0.1);
                ">${person.avatar}</div>
                <h2 style="margin: 0 0 8px 0; font-size: 1.6rem; color: #43332A; font-weight: 700;">${person.name}</h2>
                ${headerInfo}
            </div>
            
            <!-- 分享/故事内容 -->
            <div style="margin-bottom: 25px;">
                <h3 style="color: #43332A; margin-bottom: 12px; font-size: 1rem; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                    <span style="display: inline-block; width: 4px; height: 18px; background: #43332A; border-radius: 2px;"></span>
                    ${isChinese ? '📝 分享' : '📝 Story'}
                </h3>
                <div style="background: rgba(67, 51, 42, 0.03); border-left: 3px solid #43332A; padding: 15px 18px; border-radius: 0 8px 8px 0;">
                    <p style="line-height: 1.7; margin: 0; color: #4A3B2E; font-size: 0.95rem;">${person.content}</p>
                </div>
            </div>
            
            <!-- 见解/Insight -->
            <div style="margin-bottom: 20px;">
                <h3 style="color: #d97706; margin-bottom: 12px; font-size: 1rem; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                    <span style="display: inline-block; width: 4px; height: 18px; background: #d97706; border-radius: 2px;"></span>
                    ${isChinese ? '💡 见解' : '💡 Insight'}
                </h3>
                <div style="background: rgba(217, 119, 6, 0.05); border-left: 3px solid #d97706; padding: 15px 18px; border-radius: 0 8px 8px 0;">
                    <p style="line-height: 1.7; margin: 0; color: #78350f; font-size: 0.95rem;">${person.insight}</p>
                </div>
            </div>
            
            <!-- 底部日期 -->
            <div style="text-align: right; padding-top: 15px; border-top: 1px solid rgba(67, 51, 42, 0.1);">
                <span style="color: #A39680; font-size: 0.85rem; font-family: 'Courier New', monospace;">${isChinese ? '分享日期' : 'Date'}：${person.date}</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 点击背景关闭模态框
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// 页面加载时初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    // 初始化共创社区
    generateUserCards();
    initCommunityTabs();
    updateScrollIndicator();
    
    // 延迟初始化地图，确保DOM完全加载
    setTimeout(() => {
        initZengchengMap();
    }, 500);
});

// 键盘导航
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        container.scrollBy({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        container.scrollBy({
            top: -window.innerHeight,
            behavior: 'smooth'
        });
    }
});

// ===== ECharts增城地图功能 =====
let zengchengChart;
let zengchengGeoJSON;

// 初始化增城地图
function initZengchengMap() {
    const mapContainer = document.getElementById('zengchengMap');
    if (!mapContainer) return;
    
    // 创建ECharts实例
    zengchengChart = echarts.init(mapContainer);
    
    // 加载增城地图数据
    loadZengchengData();
}

// 加载广东省GeoJSON数据
async function loadZengchengData() {
    try {
        const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/440000_full.json');
        if (!response.ok) {
            throw new Error('无法获取广东省地图数据');
        }
        zengchengGeoJSON = await response.json();

        // 注册地图
        echarts.registerMap('guangdong', zengchengGeoJSON);

        // 设置地图选项
        setGuangdongMapOption();

    } catch (error) {
        console.error('加载广东省地图失败:', error);
        document.getElementById('zengchengMap').innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #77685A;">
                <div style="text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">⚠️</div>
                    <div>地图加载失败</div>
                    <div style="font-size: 0.9rem; margin-top: 5px;">请检查网络连接</div>
                </div>
            </div>
        `;
    }
}

// 设置广东省地图配置
function setGuangdongMapOption() {
    const option = {
        title: {
            left: 'center',
            top: 10,
            textStyle: {
                color: '#43332A',
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#B4322F',
            borderWidth: 1,
            textStyle: {
                color: '#4A3B2E'
            },
            formatter: function(params) {
                if (params.componentType === 'geo') {
                    return `<div style="padding: 8px;">
                        <div style="font-weight: bold; color: #43332A; margin-bottom: 5px;">${params.name}</div>
                        <div style="color: #77685A;">广东省</div>
                    </div>`;
                }
                return params.name;
            }
        },
        geo: {
            map: 'guangdong',
            roam: false, // 禁用缩放和拖动
            zoom: 1.1, // 放大地图
            center: [113.3, 23.0], // 广东省中心点
            label: {
                show: true,
                fontSize: 10,
                color: '#4A3B2E',
                fontWeight: 'normal'
            },
            itemStyle: {
                areaColor: '#F6EFE0',  // 淡蓝色主题
                borderColor: '#B4322F',
                borderWidth: 1,
                shadowColor: 'rgba(180, 50, 47, 0.1)',
                shadowBlur: 5
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 12,
                    color: '#43332A',
                    fontWeight: 'bold'
                },
                itemStyle: {
                    areaColor: '#E4D7B8',
                    borderColor: '#43332A',
                    borderWidth: 2,
                    shadowColor: 'rgba(180, 50, 47, 0.2)',
                    shadowBlur: 10
                }
            }
        },
        series: []
    };

    zengchengChart.setOption(option);

    // 添加标记点
    addMapMarkers();
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        zengchengChart.resize();
    });
}

// 添加地图标记点
function addMapMarkers() {
    // 广东省非遗项目节点数据
    const heritageSites = [
        {
            name: '增城(Zengcheng)',
            position: [113.81, 23.10],
            images: [],
            intro: { zh: '中国荔枝之乡', en: 'China\'s Hometown of Lychee' },
            heritage: [
                { zh: '荔枝传说文化（省级非遗）', en: 'Lychee Legend Culture (Provincial ICH)' },
                { zh: '传统荔枝种植技艺', en: 'Traditional Lychee Cultivation Techniques' },
                { zh: '北园绿荔枝（区级非遗）', en: 'Beiyuanlv Lychee (District ICH)' }
            ],
            coreSites: [
                { zh: '仙村万亩荔枝园', en: 'Xiancun Lychee Orchard' },
                { zh: '增城荔枝文化公园', en: 'Zengcheng Lychee Culture Park' },
                { zh: '正果荔枝古树林', en: 'Zhenggu Ancient Lychee Forest' }
            ]
        },
        {
            name: '东莞(Dongguan)',
            position: [113.90, 22.48],
            images: [],
            intro: { zh: '广东香都', en: 'Capital of Incense in Guangdong' },
            heritage: [
                { zh: '莞香制作工艺（国家级非遗）', en: 'Guangxiang Incense Craft (National ICH)' },
                { zh: '传统香道文化', en: 'Traditional Incense Culture' }
            ],
            coreSites: [
                { zh: '大岭山莞香种植区', en: 'Dalingshan Incense Planting Area' },
                { zh: '莞香非遗保护中心', en: 'Guangxiang ICH Protection Center' }
            ]
        },
        {
            name: '化州(Huazhou)',
            position: [111.63, 21.66],
            images: [],
            intro: { zh: '南方人参·化痰圣药', en: 'Southern Ginseng · Sacred Medicine for Phlegm' },
            heritage: [
                { zh: '化橘红栽培与炮制工艺（省级非遗）', en: 'Huajuhong Cultivation & Processing (Provincial ICH)' },
                { zh: '岭南中医药文化', en: 'Lingnan Traditional Chinese Medicine Culture' },
                { zh: '礞石土壤核心种植区', en: 'Mengshi Soil Core Planting Area' }
            ],
            coreSites: [
                { zh: '化橘红文化博览馆', en: 'Huajuhong Culture Museum' },
                { zh: '平定镇种植示范基地', en: 'Pingding Town Demonstration Base' }
            ]
        },
        {
            name: '新会(Xinhui)',
            position: [113.03, 21.86],
            images: [],
            intro: { zh: '广东三宝之首', en: 'First of Guangdong\'s Three Treasures' },
            heritage: [
                { zh: '新会陈皮制作工艺（国家级非遗）', en: 'Xinhui Dried Tangerine Peel Craft (National ICH)' },
                { zh: '广陈皮道地药材文化', en: 'Authentic Guangdong Dried Tangerine Peel Culture' }
            ],
            coreSites: [
                { zh: '古井镇陈皮仓储基地', en: 'Gujing Town Chenpi Storage Base' },
                { zh: '陈皮文化博物馆', en: 'Chenpi Culture Museum' },
                { zh: '茶枝柑核心种植区', en: 'Chazhi Mandarin Core Planting Area' }
            ]
        },
        {
            name: '潮州(Chaozhou)',
            position: [116.1, 23.3],
            images: [],
            intro: { zh: '潮汕文化核心', en: 'Heart of Chaoshan Culture' },
            heritage: [
                { zh: '功夫茶茶艺（人类非遗代表）', en: 'Kung Fu Tea Art (UNESCO Intangible Heritage)' },
                { zh: '凤凰单丛茶制作技艺', en: 'Fenghuang Dancong Tea Making Techniques' },
                { zh: '潮汕民俗文化', en: 'Chaoshan Folk Culture' }
            ],
            coreSites: [
                { zh: '广济桥功夫茶体验点', en: 'Guangji Bridge Kung Fu Tea Experience' },
                { zh: '凤凰茶博物馆', en: 'Fenghuang Tea Museum' }
            ]
        }
    ];

    // 创建标记点容器
    const markersContainer = document.getElementById('mapMarkers');
    if (!markersContainer) return;

    // 清空现有标记
    markersContainer.innerHTML = '';

    heritageSites.forEach((site, index) => {
        const marker = document.createElement('div');
        marker.className = 'map-marker';
        marker.setAttribute('data-name', site.name);
        marker.setAttribute('data-index', index);
        
        // 将经纬度转换为地图上的像素位置
        // 广东省大致范围：经度 109.5-117.5，纬度 20.0-25.5
        const mapBounds = {
            minLng: 109.5,
            maxLng: 117.5,
            minLat: 20.0,
            maxLat: 25.5
        };
        
        const lng = site.position[0];
        const lat = site.position[1];
        
        // 计算相对位置（百分比）
        const leftPercent = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
        const topPercent = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
        
        marker.style.left = `${leftPercent}%`;
        marker.style.top = `${topPercent}%`;
        marker.style.position = 'absolute';
        
        // 添加标签
        const label = document.createElement('div');
        label.className = 'marker-label';
        label.textContent = site.name;
        marker.appendChild(label);
        
        // 标记点点击事件
        marker.addEventListener('click', () => {
            // 移除所有活跃状态
            document.querySelectorAll('.map-marker').forEach(m => m.classList.remove('active'));
            marker.classList.add('active');
            
            // 更新左侧卡片信息
            updateLocationCard(site);
            
            // 触发节点点击回调（如果有）
            if (window.onMapNodeClick) {
                window.onMapNodeClick(site, index);
            }
        });
        
        markersContainer.appendChild(marker);
    });

    // 保存heritageSites数据供后续使用
    window.heritageSitesData = heritageSites;

    // 默认选中第一个标记点（增城）并显示其信息
    const firstMarker = markersContainer.querySelector('.map-marker');
    if (firstMarker) {
        firstMarker.classList.add('active');
        updateLocationCard(heritageSites[0]);
    }
}

// 更新地点信息卡片
// 当前语言状态
let currentLang = 'zh';

// 切换语言
function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    
    // 更新按钮显示
    const btn = document.getElementById('langSwitchBtn');
    if (btn) {
        const currentSpan = btn.querySelector('.lang-current');
        const otherSpan = btn.querySelector('.lang-other');
        if (currentSpan && otherSpan) {
            currentSpan.textContent = currentLang === 'zh' ? '中' : 'EN';
            otherSpan.textContent = currentLang === 'zh' ? 'EN' : '中';
        }
    }
    
    // 更新所有带data-zh和data-en属性的元素
    document.querySelectorAll('[data-zh][data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${currentLang}`);
    });
    
    // 更新当前选中的地点卡片
    const activeMarker = document.querySelector('.map-marker.active');
    if (activeMarker && window.heritageSitesData) {
        const siteIndex = parseInt(activeMarker.getAttribute('data-index'));
        if (window.heritageSitesData[siteIndex]) {
            updateLocationCard(window.heritageSitesData[siteIndex]);
        }
    }
}

function updateLocationCard(site) {
    const locationName = document.getElementById('locationName');
    const introText = document.getElementById('introText');
    const heritageList = document.getElementById('heritageList');
    const coreSites = document.getElementById('coreSites');
    
    if (!locationName || !heritageList || !coreSites) return;
    
    // 更新地点名称
    locationName.textContent = site.name;
    
    // 更新介绍
    if (introText) {
        const introContent = typeof site.intro === 'object' ? site.intro[currentLang] : site.intro;
        introText.innerHTML = `<p data-zh="${typeof site.intro === 'object' ? site.intro.zh : site.intro}" data-en="${typeof site.intro === 'object' ? site.intro.en : site.intro}">${introContent}</p>`;
    }
    
    // 更新非遗与文化列表
    heritageList.innerHTML = site.heritage.map(item => {
        const text = typeof item === 'object' ? item[currentLang] : item;
        const zhText = typeof item === 'object' ? item.zh : item;
        const enText = typeof item === 'object' ? item.en : item;
        return `
            <div class="heritage-item">
                <span class="heritage-dot"></span>
                <span class="heritage-text" data-zh="${zhText}" data-en="${enText}">${text}</span>
            </div>
        `;
    }).join('');
    
    // 更新核心点位
    coreSites.innerHTML = site.coreSites.map(siteItem => {
        const text = typeof siteItem === 'object' ? siteItem[currentLang] : siteItem;
        const zhText = typeof siteItem === 'object' ? siteItem.zh : siteItem;
        const enText = typeof siteItem === 'object' ? siteItem.en : siteItem;
        return `
            <span class="site-tag" data-zh="${zhText}" data-en="${enText}">${text}</span>
        `;
    }).join('');
}

// 导出更新卡片函数供全局使用
window.updateLocationCard = updateLocationCard;
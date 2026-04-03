// 广东非遗知识图谱 - 学术版（高级配色版）
// 以广东非遗为中心，五大农遗为一级节点

// 知识图谱数据结构
const knowledgeGraphData = {
    center: {
        id: 'guangdong-heritage',
        name: '广东非遗',
        nameEn: 'Guangdong Intangible Cultural Heritage',
        type: 'center',
        icon: '📖',
        description: '岭南文化瑰宝，包含农业、手工艺、民俗等多元非遗体系',
        descriptionEn: 'A treasure of Lingnan culture, encompassing diverse intangible heritage systems including agriculture, handicrafts, and folk customs',
        features: [
            '岭南文化核心区 / Lingnan Cultural Core',
            '多元非遗体系 / Diverse Heritage Systems',
            '农业文化遗产富集 / Rich Agricultural Heritage',
            '传统手工艺发达 / Developed Traditional Crafts',
            '民俗活动丰富 / Rich Folk Activities',
            '非遗保护先行区 / Pioneer in Heritage Protection',
            '文化传承重地 / Important Cultural Heritage Site',
            '国际传播窗口 / International Communication Window'
        ]
    },
    
    level1: [
        {
            id: 'zengcheng',
            name: '增城荔枝',
            nameEn: 'Zengcheng Lychee',
            type: 'level1',
            category: 'zengcheng',
            icon: '🍒',
            description: '中国荔枝之乡，国家地理标志产品，岭南荔枝核心产区',
            descriptionEn: 'Hometown of Chinese Lychee, National Geographical Indication Product, Core Production Area of Lingnan Lychee',
            angle: 0,
            expanded: false
        },
        {
            id: 'huazhou',
            name: '化州化橘红',
            nameEn: 'Huazhou Huajuhong',
            type: 'level1',
            category: 'huazhou',
            icon: '🍊',
            description: '南方人参，化痰圣药，岭南中医药文化瑰宝',
            descriptionEn: 'Ginseng of the South, Sacred Medicine for Phlegm Removal, Treasure of Lingnan Traditional Chinese Medicine Culture',
            angle: 72,
            expanded: false
        },
        {
            id: 'chaozhou',
            name: '潮州单丛茶',
            nameEn: 'Chaozhou Dancong Tea',
            type: 'level1',
            category: 'chaozhou',
            icon: '🍵',
            description: '工夫茶艺发源地，凤凰单丛香飘四海',
            descriptionEn: 'Birthplace of Kung Fu Tea Art, Phoenix Dancong Tea Fragrance Spreads Worldwide',
            angle: 144,
            expanded: false
        },
        {
            id: 'dongguan',
            name: '东莞莞香',
            nameEn: 'Dongguan Incense',
            type: 'level1',
            category: 'dongguan',
            icon: '🌿',
            description: '广东香都，千年制香技艺，海上丝绸之路香料',
            descriptionEn: 'Incense Capital of Guangdong, Millennium-old Incense-making Craft, Spice of Maritime Silk Road',
            angle: 216,
            expanded: false
        },
        {
            id: 'xinhui',
            name: '新会陈皮',
            nameEn: 'Xinhui Dried Tangerine Peel',
            type: 'level1',
            category: 'xinhui',
            icon: '🍂',
            description: '广东三宝之首，百年陈皮胜黄金',
            descriptionEn: 'First of Guangdong Three Treasures, Century-old Chenpi Surpasses Gold',
            angle: 288,
            expanded: false
        }
    ],
    
    level2: {
        zengcheng: [
            { id: 'zc-culture', name: '文化介绍', nameEn: 'Cultural Introduction', type: 'level2', category: 'zengcheng', description: '增城荔枝千年文化，贡品传统与荔枝传说', descriptionEn: 'Millennium-old Zengcheng Lychee Culture, Tribute Tradition and Lychee Legends' },
            { id: 'zc-industry', name: '产业线条', nameEn: 'Industry Chain', type: 'level2', category: 'zengcheng', description: '从种植到销售的全产业链体系', descriptionEn: 'Complete Industry Chain from Planting to Sales' },
            { id: 'zc-varieties', name: '品种信息', nameEn: 'Variety Information', type: 'level2', category: 'zengcheng', description: '增城荔枝品种资源丰富多样', descriptionEn: 'Rich and Diverse Zengcheng Lychee Varieties' }
        ],
        huazhou: [
            { id: 'hz-culture', name: '文化介绍', nameEn: 'Cultural Introduction', type: 'level2', category: 'huazhou', description: '化橘红药用文化，明清贡品历史', descriptionEn: 'Huajuhong Medicinal Culture, Ming and Qing Dynasty Tribute History' },
            { id: 'hz-industry', name: '产业线条', nameEn: 'Industry Chain', type: 'level2', category: 'huazhou', description: '中药材种植、加工、销售产业链', descriptionEn: 'Chinese Medicinal Material Planting, Processing and Sales Industry Chain' },
            { id: 'hz-varieties', name: '品种信息', nameEn: 'Variety Information', type: 'level2', category: 'huazhou', description: '正毛橘红、副毛橘红等品种分类', descriptionEn: 'Zhengmao, Fumao and Other Huajuhong Varieties' }
        ],
        chaozhou: [
            { id: 'cz-culture', name: '文化介绍', nameEn: 'Cultural Introduction', type: 'level2', category: 'chaozhou', description: '工夫茶艺文化，潮汕茶道精神', descriptionEn: 'Kung Fu Tea Art Culture, Chaoshan Tea Ceremony Spirit' },
            { id: 'cz-industry', name: '产业线条', nameEn: 'Industry Chain', type: 'level2', category: 'chaozhou', description: '茶叶种植、制作、茶器、茶旅融合', descriptionEn: 'Tea Planting, Processing, Tea Ware, Tea Tourism Integration' },
            { id: 'cz-varieties', name: '品种信息', nameEn: 'Variety Information', type: 'level2', category: 'chaozhou', description: '凤凰单丛十大香型，宋种古树', descriptionEn: 'Ten Aroma Types of Phoenix Dancong, Songzhong Ancient Trees' }
        ],
        dongguan: [
            { id: 'dg-culture', name: '文化介绍', nameEn: 'Cultural Introduction', type: 'level2', category: 'dongguan', description: '莞香文化，香道传承，海上香路', descriptionEn: 'Guangxiang Culture, Incense Ceremony Heritage, Maritime Incense Route' },
            { id: 'dg-industry', name: '产业线条', nameEn: 'Industry Chain', type: 'level2', category: 'dongguan', description: '沉香种植、采香、制香、香道培训', descriptionEn: 'Agarwood Planting, Harvesting, Processing, Incense Ceremony Training' },
            { id: 'dg-varieties', name: '品种信息', nameEn: 'Variety Information', type: 'level2', category: 'dongguan', description: '土沉香、奇楠沉香等品种等级', descriptionEn: 'Native Agarwood, Qinan and Other Agarwood Grades' }
        ],
        xinhui: [
            { id: 'xh-culture', name: '文化介绍', nameEn: 'Cultural Introduction', type: 'level2', category: 'xinhui', description: '陈皮文化，越陈越香，药食同源', descriptionEn: 'Chenpi Culture, Better with Age, Medicine and Food Same Source' },
            { id: 'xh-industry', name: '产业线条', nameEn: 'Industry Chain', type: 'level2', category: 'xinhui', description: '柑种植、陈皮制作、仓储陈化、品牌营销', descriptionEn: 'Mandarin Planting, Chenpi Making, Storage Aging, Brand Marketing' },
            { id: 'xh-varieties', name: '品种信息', nameEn: 'Variety Information', type: 'level2', category: 'xinhui', description: '茶枝柑品种，新会核心产区', descriptionEn: 'Chazhi Mandarin Variety, Xinhui Core Production Area' }
        ]
    },
    
    level3: {
        // 增城荔枝三级节点
        'zc-culture': [
            { id: 'zc-legend', name: '荔枝传说', nameEn: 'Lychee Legends', type: 'level3', category: 'zengcheng', description: '何仙姑与挂绿荔枝的美丽传说，增城挂绿被誉为"荔枝之王"', descriptionEn: 'Beautiful legend of He Xiangu and Gualv Lychee, Zengcheng Gualv known as "King of Lychees"' },
            { id: 'zc-tribute', name: '贡品历史', nameEn: 'Tribute History', type: 'level3', category: 'zengcheng', description: '明清时期进贡皇室的珍贵荔枝，康熙年间已列为贡品', descriptionEn: 'Precious lychees tribute to imperial court during Ming and Qing dynasties, listed as tribute in Kangxi period' },
            { id: 'zc-festival', name: '荔枝文化节', nameEn: 'Lychee Culture Festival', type: 'level3', category: 'zengcheng', description: '一年一度的增城荔枝文化节活动，展示荔枝文化与产业发展', descriptionEn: 'Annual Zengcheng Lychee Culture Festival showcasing lychee culture and industry development' }
        ],
        'zc-industry': [
            { id: 'zc-planting', name: '种植基地', nameEn: 'Planting Bases', type: 'level3', category: 'zengcheng', description: '仙村、小楼等核心种植区域，总面积超18万亩', descriptionEn: 'Core planting areas in Xiancun, Xiaolou, total area over 180,000 mu' },
            { id: 'zc-processing', name: '深加工', nameEn: 'Deep Processing', type: 'level3', category: 'zengcheng', description: '荔枝干、荔枝酒、荔枝蜜、荔枝醋等多元化产品', descriptionEn: 'Diversified products: dried lychee, lychee wine, lychee honey, lychee vinegar' },
            { id: 'zc-brand', name: '品牌营销', nameEn: 'Brand Marketing', type: 'level3', category: 'zengcheng', description: '增城荔枝区域公用品牌建设，电商直播销售新模式', descriptionEn: 'Zengcheng Lychee regional public brand building, new e-commerce live streaming sales model' }
        ],
        'zc-varieties': [
            { id: 'zc-gualv', name: '增城挂绿', nameEn: 'Zengcheng Gualv', type: 'level3', category: 'zengcheng', description: '增城最珍贵的荔枝品种，曾为贡品，果肉爽脆清甜', descriptionEn: 'Most precious Zengcheng lychee variety, former tribute, crisp and sweet flesh' },
            { id: 'zc-xianjinfeng', name: '仙进奉', nameEn: 'Xianjinfeng', type: 'level3', category: 'zengcheng', description: '古代贡品，品质上乘的珍稀品种，果肉厚核小', descriptionEn: 'Ancient tribute, premium rare variety, thick flesh small seed' },
            { id: 'zc-guiwei', name: '桂味', nameEn: 'Guiwei', type: 'level3', category: 'zengcheng', description: '带有桂花香气，味道清甜，肉质爽脆', descriptionEn: 'Osmanthus fragrance, sweet taste, crisp texture' },
            { id: 'zc-nuomici', name: '糯米糍', nameEn: 'Nuomici', type: 'level3', category: 'zengcheng', description: '果肉软糯如糯米，核小肉厚，口感极佳', descriptionEn: 'Glutinous rice-like flesh, small seed thick meat, excellent taste' },
            { id: 'zc-shuijingqiu', name: '水晶球', nameEn: 'Shuijingqiu', type: 'level3', category: 'zengcheng', description: '果肉晶莹剔透，如同水晶，清甜多汁', descriptionEn: 'Crystal clear flesh like crystal, sweet and juicy' }
        ],
        
        // 化州化橘红三级节点
        'hz-culture': [
            { id: 'hz-medicine', name: '药用文化', nameEn: 'Medicinal Culture', type: 'level3', category: 'huazhou', description: '明清时期御用化痰良药，被誉为"南方人参"', descriptionEn: 'Imperial phlegm-removing medicine in Ming and Qing dynasties, known as "Ginseng of the South"' },
            { id: 'hz-tribute', name: '贡品历史', nameEn: 'Tribute History', type: 'level3', category: 'huazhou', description: '清朝贡品，宫廷御用，光绪年间被列为贡品', descriptionEn: 'Qing Dynasty tribute, imperial use, listed as tribute in Guangxu period' },
            { id: 'hz-origin', name: '道地药材', nameEn: 'Authentic Medicinal Material', type: 'level3', category: 'huazhou', description: '礞石土壤孕育的道地药材，化州独有', descriptionEn: 'Authentic medicine nurtured by Mengshi soil, unique to Huazhou' }
        ],
        'hz-industry': [
            { id: 'hz-planting', name: '种植基地', nameEn: 'Planting Bases', type: 'level3', category: 'huazhou', description: '平定、文楼等核心产区，标准化种植示范基地', descriptionEn: 'Core production areas in Pingding, Wenlou, standardized planting demonstration bases' },
            { id: 'hz-processing', name: '炮制工艺', nameEn: 'Processing Techniques', type: 'level3', category: 'huazhou', description: '传统七爪、五爪炮制技艺，省级非物质文化遗产', descriptionEn: 'Traditional seven-claw, five-claw processing techniques, provincial intangible cultural heritage' },
            { id: 'hz-products', name: '系列产品', nameEn: 'Product Series', type: 'level3', category: 'huazhou', description: '橘红片、橘红膏、橘红茶、橘红饮料等多元化产品', descriptionEn: 'Diversified products: Huajuhong slices, paste, tea, beverages' }
        ],
        'hz-varieties': [
            { id: 'hz-zhengmao', name: '正毛橘红', nameEn: 'Zhengmao Huajuhong', type: 'level3', category: 'huazhou', description: '品质最优，绒毛浓密，药效最佳', descriptionEn: 'Best quality, dense fuzz, optimal medicinal effect' },
            { id: 'hz-fumao', name: '副毛橘红', nameEn: 'Fumao Huajuhong', type: 'level3', category: 'huazhou', description: '绒毛较少，品质次之，仍具良好药效', descriptionEn: 'Less fuzz, secondary quality, still good medicinal effect' },
            { id: 'hz-guang', name: '光青橘红', nameEn: 'Guangqing Huajuhong', type: 'level3', category: 'huazhou', description: '表面光滑，无绒毛，适合日常饮用', descriptionEn: 'Smooth surface, no fuzz, suitable for daily consumption' }
        ],
        
        // 潮州单丛茶三级节点
        'cz-culture': [
            { id: 'cz-gongfu', name: '工夫茶艺', nameEn: 'Kung Fu Tea Art', type: 'level3', category: 'chaozhou', description: '21式工夫茶艺，人类非物质文化遗产代表作', descriptionEn: '21-step Kung Fu Tea Art, Masterpiece of Intangible Cultural Heritage of Humanity' },
            { id: 'cz-ceremony', name: '茶道精神', nameEn: 'Tea Ceremony Spirit', type: 'level3', category: 'chaozhou', description: '和敬精乐的茶道哲学，体现潮汕人文精神', descriptionEn: 'Tea ceremony philosophy of Harmony, Respect, Refinement and Joy, embodying Chaoshan humanistic spirit' },
            { id: 'cz-heritage', name: '非遗传承', nameEn: 'Heritage Inheritance', type: 'level3', category: 'chaozhou', description: '制茶技艺代代相传，国家级非物质文化遗产', descriptionEn: 'Tea-making skills passed down through generations, national intangible cultural heritage' }
        ],
        'cz-industry': [
            { id: 'cz-planting', name: '凤凰茶区', nameEn: 'Phoenix Tea Area', type: 'level3', category: 'chaozhou', description: '乌岽山、大庵等古茶园，海拔350-1498米', descriptionEn: 'Ancient tea gardens in Wudong Mountain, Daan, altitude 350-1498 meters' },
            { id: 'cz-making', name: '制茶工艺', nameEn: 'Tea Making Process', type: 'level3', category: 'chaozhou', description: '采青、晒青、做青、杀青、揉捻、烘焙六道工序', descriptionEn: 'Six processes: picking, withering, shaking, killing green, rolling, baking' },
            { id: 'cz-teaware', name: '茶器文化', nameEn: 'Tea Ware Culture', type: 'level3', category: 'chaozhou', description: '潮汕工夫茶具四宝：茶壶、茶杯、茶洗、茶盘', descriptionEn: 'Four treasures of Chaoshan Kung Fu tea: teapot, teacup, tea washer, tea tray' }
        ],
        'cz-varieties': [
            { id: 'cz-songzhong', name: '宋种', nameEn: 'Songzhong', type: 'level3', category: 'chaozhou', description: '宋代古树，茶中极品，香气浓郁持久', descriptionEn: 'Song Dynasty ancient tree, top-grade tea, rich and lasting aroma' },
            { id: 'cz-yashixiang', name: '鸭屎香', nameEn: 'Yashixiang', type: 'level3', category: 'chaozhou', description: '银花香型，香气独特，回甘持久', descriptionEn: 'Silver flower aroma type, unique fragrance, lasting sweet aftertaste' },
            { id: 'cz-milanxiang', name: '蜜兰香', nameEn: 'Milanxiang', type: 'level3', category: 'chaozhou', description: '蜜香浓郁，兰香幽雅，深受茶友喜爱', descriptionEn: 'Rich honey aroma, elegant orchid fragrance, beloved by tea enthusiasts' },
            { id: 'cz-huangzhixiang', name: '黄枝香', nameEn: 'Huangzhixiang', type: 'level3', category: 'chaozhou', description: '黄栀子花香，清新怡人，香气高扬', descriptionEn: 'Yellow gardenia flower fragrance, fresh and pleasant, high aroma' },
            { id: 'cz-zhilaniao', name: '芝兰香', nameEn: 'Zhilanxiang', type: 'level3', category: 'chaozhou', description: '芝兰花香，高雅清幽，茶中贵族', descriptionEn: 'Elegant orchid fragrance, noble and serene, aristocrat among teas' }
        ],
        
        // 东莞莞香三级节点
        'dg-culture': [
            { id: 'dg-history', name: '千年香史', nameEn: 'Millennial Incense History', type: 'level3', category: 'dongguan', description: '自唐代开始的制香历史，距今已有一千多年', descriptionEn: 'Incense-making history since Tang Dynasty, over 1000 years ago' },
            { id: 'dg-maritime', name: '海上香路', nameEn: 'Maritime Incense Route', type: 'level3', category: 'dongguan', description: '海上丝绸之路重要香料，远销东南亚及世界各地', descriptionEn: 'Important spice of Maritime Silk Road, exported to Southeast Asia and worldwide' },
            { id: 'dg-ceremony', name: '香道文化', nameEn: 'Incense Ceremony Culture', type: 'level3', category: 'dongguan', description: '品香、斗香传统，体现东方生活美学', descriptionEn: 'Traditions of incense tasting and competition, embodying Eastern life aesthetics' }
        ],
        'dg-industry': [
            { id: 'dg-planting', name: '沉香种植', nameEn: 'Agarwood Planting', type: 'level3', category: 'dongguan', description: '大岭山、寮步种植基地，生态种植示范基地', descriptionEn: 'Planting bases in Dalingshan, Liaobu, ecological planting demonstration bases' },
            { id: 'dg-harvesting', name: '采香技艺', nameEn: 'Incense Harvesting Skills', type: 'level3', category: 'dongguan', description: '传统人工采香方法，国家级非物质文化遗产', descriptionEn: 'Traditional manual incense harvesting methods, national intangible cultural heritage' },
            { id: 'dg-products', name: '香品系列', nameEn: 'Incense Product Series', type: 'level3', category: 'dongguan', description: '线香、盘香、香粉、精油、香囊等多元化产品', descriptionEn: 'Diversified products: stick incense, coil incense, powder, essential oil, sachets' }
        ],
        'dg-varieties': [
            { id: 'dg-tu', name: '土沉香', nameEn: 'Native Agarwood', type: 'level3', category: 'dongguan', description: '本土白木香树种，莞香的主要原料', descriptionEn: 'Local Aquilaria sinensis, main raw material of Guangxiang' },
            { id: 'dg-qinan', name: '奇楠沉香', nameEn: 'Qinan Agarwood', type: 'level3', category: 'dongguan', description: '沉香中的极品，油脂丰富，香气醇厚', descriptionEn: 'Top grade of agarwood, rich resin, mellow aroma' },
            { id: 'dg-sinking', name: '沉水香', nameEn: 'Sinking Grade', type: 'level3', category: 'dongguan', description: '密度大，入水即沉，品质上乘', descriptionEn: 'High density, sinks in water, superior quality' }
        ],
        
        // 新会陈皮三级节点
        'xh-culture': [
            { id: 'xh-history', name: '陈皮历史', nameEn: 'Chenpi History', type: 'level3', category: 'xinhui', description: '宋代开始的新会陈皮文化，距今已有七百多年', descriptionEn: 'Xinhui Chenpi culture since Song Dynasty, over 700 years ago' },
            { id: 'xh-medicine', name: '药食同源', nameEn: 'Medicine and Food Same Source', type: 'level3', category: 'xinhui', description: '入膳可调百味，入药可和百药，养生佳品', descriptionEn: 'Enhances hundred dishes, harmonizes hundred medicines, excellent health product' },
            { id: 'xh-aging', name: '陈化文化', nameEn: 'Aging Culture', type: 'level3', category: 'xinhui', description: '三年陈、五年香、十年宝，越陈越香', descriptionEn: 'Three years aged, five years fragrant, ten years treasure, better with age' }
        ],
        'xh-industry': [
            { id: 'xh-planting', name: '核心产区', nameEn: 'Core Production Area', type: 'level3', category: 'xinhui', description: '天马、梅江、茶坑等一线产区，品质最佳', descriptionEn: 'First-tier production areas: Tianma, Meijiang, Chakeng, best quality' },
            { id: 'xh-making', name: '制作工艺', nameEn: 'Making Process', type: 'level3', category: 'xinhui', description: '开皮、翻皮、晒皮、陈化，传统手工制作', descriptionEn: 'Peeling, turning, sun-drying, aging, traditional handmade process' },
            { id: 'xh-storage', name: '仓储陈化', nameEn: 'Storage Aging', type: 'level3', category: 'xinhui', description: '干仓陈化，自然转化，年份越久价值越高', descriptionEn: 'Dry warehouse aging, natural transformation, higher value with longer aging' }
        ],
        'xh-varieties': [
            { id: 'xh-chazhi', name: '茶枝柑', nameEn: 'Chazhi Mandarin', type: 'level3', category: 'xinhui', description: '新会特有柑品种，制作陈皮的最佳原料', descriptionEn: 'Xinhui unique mandarin variety, best raw material for Chenpi' },
            { id: 'xh-daichagan', name: '大红柑', nameEn: 'Big Red Mandarin', type: 'level3', category: 'xinhui', description: '完全成熟大红柑皮，甜度最高，适合日常', descriptionEn: 'Fully mature big red mandarin peel, highest sweetness, suitable for daily use' },
            { id: 'xh-erhong', name: '二红柑', nameEn: 'Second Red Mandarin', type: 'level3', category: 'xinhui', description: '半成熟二红柑皮，药用价值高', descriptionEn: 'Semi-mature second red mandarin peel, high medicinal value' },
            { id: 'xh-qingpi', name: '青皮', nameEn: 'Green Peel', type: 'level3', category: 'xinhui', description: '未成熟青柑皮，药用功效最强', descriptionEn: 'Immature green mandarin peel, strongest medicinal effect' }
        ]
    }
};

// 节点详细信息数据
const nodeDetails = {
    'guangdong-heritage': {
        title: '广东非遗',
        subtitle: 'Guangdong Intangible Cultural Heritage',
        sections: [
            {
                title: '文化地位 / Cultural Status',
                content: '广东是岭南文化的核心区，拥有丰富的非物质文化遗产资源。从农业到手工艺，从民俗到戏曲，形成了多元共生的非遗体系。广东非遗承载着岭南人民的历史记忆和文化基因，是中华文明的重要组成部分。'
            },
            {
                title: '非遗体系 / Heritage System',
                content: '广东非遗涵盖传统技艺、传统医药、民俗等多个类别。其中农业文化遗产尤为突出，增城荔枝、化州橘红、潮州工夫茶、东莞莞香、新会陈皮等享誉海内外，成为岭南文化的重要名片。'
            },
            {
                title: '保护传承 / Protection & Inheritance',
                content: '广东省建立了完善的非遗保护体系，包括国家级、省级、市级、县级四级名录制度，通过传承人培养、生产性保护、数字化记录等方式促进非遗活态传承，让传统文化在现代社会焕发新的生机。'
            }
        ]
    },
    'zengcheng': {
        title: '增城荔枝',
        subtitle: 'Zengcheng Lychee',
        sections: [
            {
                title: '地理优势 / Geographic Advantages',
                content: '北回归线穿过增城，属亚热带季风气候，光照充足，雨量充沛。土壤以红壤、赤红壤为主，富含矿物质，为荔枝生长提供了得天独厚的自然条件。增城因此被誉为"中国荔枝之乡"。'
            },
            {
                title: '产业规模 / Industry Scale',
                content: '增城荔枝种植面积超过18万亩，年产量达数万吨，年产值超百亿元。已形成从种植、加工到销售的完整产业链，产品远销国内外市场，成为增城经济发展的重要支柱产业。'
            },
            {
                title: '品牌价值 / Brand Value',
                content: '增城荔枝是中国国家地理标志产品，"增城挂绿"更是荔枝中的珍品，具有极高的品牌价值和文化意义。增城荔枝文化节每年吸引大量游客，成为展示岭南文化的重要窗口。'
            }
        ]
    },
    'huazhou': {
        title: '化州化橘红',
        subtitle: 'Huazhou Huajuhong',
        sections: [
            {
                title: '药用价值 / Medicinal Value',
                content: '化橘红被誉为"南方人参"，具有理气宽中、燥湿化痰的功效。其独特的礞石土壤孕育了道地药材品质，明清时期即为宫廷贡品。现代药理研究表明，化橘红具有抗炎、抗氧化、降血脂等多种功效。'
            },
            {
                title: '核心产区 / Core Production Area',
                content: '化州平定、文楼等镇为核心产区，独特的礞石土壤是化橘红品质的关键。种植历史超过1500年，形成了独特的种植文化和炮制技艺，被列入广东省非物质文化遗产名录。'
            },
            {
                title: '炮制技艺 / Processing Techniques',
                content: '传统七爪、五爪炮制技艺被列入省级非遗，经过采摘、清洗、开皮、压型、干燥、陈化等多道工序。每一道工序都需要经验丰富的匠人精心操作，确保化橘红的品质和药效。'
            }
        ]
    },
    'chaozhou': {
        title: '潮州单丛茶',
        subtitle: 'Chaozhou Dancong Tea',
        sections: [
            {
                title: '茶区环境 / Tea Growing Environment',
                content: '凤凰山海拔350-1498米，云雾缭绕，昼夜温差大。独特的火山岩土壤富含矿物质，孕育了凤凰单丛的独特品质。这里生长的茶树吸收了天地之精华，形成了独特的"山韵"。'
            },
            {
                title: '工夫茶艺 / Kung Fu Tea Art',
                content: '潮州工夫茶艺是国家级非遗，21式冲泡程序体现了"和、敬、精、乐"的茶道精神，2022年列入人类非遗代表作名录。工夫茶不仅是一种饮茶方式，更是一种生活艺术和文化传承。'
            },
            {
                title: '香型体系 / Aroma System',
                content: '凤凰单丛以香型丰富著称，有黄枝香、芝兰香、蜜兰香、桂花香、玉兰香等十大香型，被誉为"茶中香水"。每种香型都有其独特的风味特征，满足不同茶友的品味需求。'
            }
        ]
    },
    'dongguan': {
        title: '东莞莞香',
        subtitle: 'Dongguan Incense',
        sections: [
            {
                title: '历史渊源 / Historical Origins',
                content: '东莞种植白木香、制作莞香的历史超过千年，唐代已开始进贡朝廷。明清时期，莞香通过海上丝绸之路远销海外，成为重要的贸易商品。莞香文化深深植根于东莞的历史土壤之中。'
            },
            {
                title: '采香技艺 / Harvesting Techniques',
                content: '传统莞香制作包括选种、育苗、移植、断根、开香门、育香、采香、理香、拣香、窨香、合香等十余道工序。每一步都需要匠人的精心呵护，才能产出优质的莞香。'
            },
            {
                title: '香道文化 / Incense Culture',
                content: '莞香不仅是香料，更承载着深厚的香道文化。品香、斗香是岭南文人雅士的传统活动，体现了东方生活美学。莞香文化已成为东莞城市文化的重要组成部分。'
            }
        ]
    },
    'xinhui': {
        title: '新会陈皮',
        subtitle: 'Xinhui Dried Tangerine Peel',
        sections: [
            {
                title: '道地品质 / Authentic Quality',
                content: '新会陈皮是"广东三宝"之首，以新会茶枝柑为原料，经三年以上的陈化而成。核心产区天马、梅江、茶坑、东甲、西甲为一线产区，出产的新会陈皮品质最佳，具有独特的香气和药效。'
            },
            {
                title: '陈化价值 / Aging Value',
                content: '新会陈皮"越陈越香"，有"百年陈皮胜黄金"之说。陈化过程中，挥发油、黄酮类化合物等成分发生转化，药用和食用价值不断提升。年份越久的新会陈皮，价值越高，深受收藏家喜爱。'
            },
            {
                title: '药食同源 / Medicine & Food',
                content: '新会陈皮入膳可调百味，入药可和百药。具有理气健脾、燥湿化痰的功效，是岭南地区重要的药食同源食材。无论是煲汤、煮粥还是泡茶，新会陈皮都能增添独特的风味。'
            }
        ]
    }
};

// 颜色配置 - 五个地方农遗各自配色
const categoryColors = {
    center: {
        main: '#ff6b35',
        light: '#ff8c5a',
        dark: '#e85a2b',
        gradient: 'centerGradient'
    },
    zengcheng: {
        main: '#ff2d55',
        light: '#ff6b8a',
        dark: '#c41e3a',
        gradient: 'zengchengGradient'
    },
    huazhou: {
        main: '#ff9500',
        light: '#ffb347',
        dark: '#cc7a00',
        gradient: 'huazhouGradient'
    },
    chaozhou: {
        main: '#34c759',
        light: '#6ee7b7',
        dark: '#248a3d',
        gradient: 'chaozhouGradient'
    },
    dongguan: {
        main: '#af52de',
        light: '#c4b5fd',
        dark: '#8b5cf6',
        gradient: 'dongguanGradient'
    },
    xinhui: {
        main: '#ffcc00',
        light: '#ffe066',
        dark: '#d4a574',
        gradient: 'xinhuiGradient'
    }
};

// 当前展开的一级节点
let expandedNodes = new Set();

// 初始化图谱
function initGraph() {
    const svg = document.getElementById('knowledgeGraph');
    const linksGroup = document.getElementById('links');
    const nodesGroup = document.getElementById('nodes');
    const labelsGroup = document.getElementById('labels');
    
    if (!svg) return;
    
    // 清空现有内容
    linksGroup.innerHTML = '';
    nodesGroup.innerHTML = '';
    labelsGroup.innerHTML = '';
    
    // 获取SVG尺寸
    const width = svg.clientWidth || 800;
    const height = svg.clientHeight || 600;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // 绘制中心节点
    drawCenterNode(centerX, centerY);
    
    // 绘制一级节点
    knowledgeGraphData.level1.forEach((node, index) => {
        drawLevel1Node(node, centerX, centerY, index);
    });
    
    // 绘制展开的二级节点
    expandedNodes.forEach(level1Id => {
        const level1Node = knowledgeGraphData.level1.find(n => n.id === level1Id);
        if (level1Node && level1Node.expanded) {
            drawLevel2Nodes(level1Node, centerX, centerY);
        }
    });
}

// 绘制中心节点
function drawCenterNode(x, y) {
    const nodesGroup = document.getElementById('nodes');
    const labelsGroup = document.getElementById('labels');
    
    const centerData = knowledgeGraphData.center;
    
    // 创建外发光圆
    const glowCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    glowCircle.setAttribute('cx', x);
    glowCircle.setAttribute('cy', y);
    glowCircle.setAttribute('r', 55);
    glowCircle.setAttribute('fill', 'none');
    glowCircle.setAttribute('stroke', '#ff6b35');
    glowCircle.setAttribute('stroke-width', '3');
    glowCircle.setAttribute('opacity', '0.4');
    glowCircle.setAttribute('filter', 'url(#glow)');
    glowCircle.setAttribute('class', 'glow-ring');
    nodesGroup.appendChild(glowCircle);
    
    // 创建脉冲动画圆
    const pulseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pulseCircle.setAttribute('cx', x);
    pulseCircle.setAttribute('cy', y);
    pulseCircle.setAttribute('r', 50);
    pulseCircle.setAttribute('fill', 'none');
    pulseCircle.setAttribute('stroke', '#ff6b35');
    pulseCircle.setAttribute('stroke-width', '2');
    pulseCircle.setAttribute('opacity', '0.2');
    pulseCircle.setAttribute('class', 'pulse-ring');
    nodesGroup.appendChild(pulseCircle);
    
    // 创建主圆
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', 45);
    circle.setAttribute('fill', 'url(#centerGradient)');
    circle.setAttribute('stroke', '#ff6b35');
    circle.setAttribute('stroke-width', '3');
    circle.setAttribute('filter', 'url(#premiumShadow)');
    circle.setAttribute('class', 'node center-node');
    circle.setAttribute('data-id', centerData.id);
    circle.style.cursor = 'pointer';
    
    // 添加悬停效果
    circle.addEventListener('mouseenter', function() {
        this.setAttribute('r', 50);
        this.style.filter = 'url(#premiumShadow) brightness(1.2)';
    });
    circle.addEventListener('mouseleave', function() {
        this.setAttribute('r', 45);
        this.style.filter = 'url(#premiumShadow)';
    });
    
    // 添加点击事件
    circle.addEventListener('click', () => showNodeDetails(centerData));
    
    nodesGroup.appendChild(circle);
    
    // 添加标签
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + 70);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#fff');
    text.setAttribute('font-size', '14');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('class', 'node-label-main');
    text.textContent = centerData.name;
    labelsGroup.appendChild(text);
    
    // 英文标签
    const enText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    enText.setAttribute('x', x);
    enText.setAttribute('y', y + 88);
    enText.setAttribute('text-anchor', 'middle');
    enText.setAttribute('fill', 'rgba(255,255,255,0.7)');
    enText.setAttribute('font-size', '10');
    enText.setAttribute('class', 'node-label-sub');
    enText.textContent = 'Guangdong Heritage';
    labelsGroup.appendChild(enText);
}

// 绘制一级节点
function drawLevel1Node(node, centerX, centerY, index) {
    const linksGroup = document.getElementById('links');
    const nodesGroup = document.getElementById('nodes');
    const labelsGroup = document.getElementById('labels');
    
    const angle = (node.angle * Math.PI) / 180;
    const radius = 220; // 从180增加到220，拉大中心到一级节点的距离
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    // 绘制连接线
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', centerX);
    line.setAttribute('y1', centerY);
    line.setAttribute('x2', x);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', categoryColors[node.category].main);
    line.setAttribute('stroke-width', '2.5');
    line.setAttribute('opacity', '0.7');
    line.setAttribute('class', 'link-line');
    linksGroup.appendChild(line);
    
    // 创建外圈
    const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerCircle.setAttribute('cx', x);
    outerCircle.setAttribute('cy', y);
    outerCircle.setAttribute('r', 40);
    outerCircle.setAttribute('fill', 'none');
    outerCircle.setAttribute('stroke', categoryColors[node.category].light);
    outerCircle.setAttribute('stroke-width', '2');
    outerCircle.setAttribute('opacity', '0.5');
    outerCircle.setAttribute('class', 'node-outer-ring');
    nodesGroup.appendChild(outerCircle);
    
    // 创建节点圆
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', 35);
    circle.setAttribute('fill', `url(#${categoryColors[node.category].gradient})`);
    circle.setAttribute('stroke', categoryColors[node.category].main);
    circle.setAttribute('stroke-width', '2.5');
    circle.setAttribute('filter', 'url(#premiumShadow)');
    circle.setAttribute('class', `node level1-node ${node.expanded ? 'expanded' : ''}`);
    circle.setAttribute('data-id', node.id);
    circle.style.cursor = 'pointer';
    circle.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    // 添加悬停效果
    circle.addEventListener('mouseenter', function() {
        this.setAttribute('r', 40);
        this.style.filter = 'url(#premiumShadow) brightness(1.15)';
        outerCircle.setAttribute('r', 45);
        outerCircle.setAttribute('opacity', '0.8');
    });
    circle.addEventListener('mouseleave', function() {
        this.setAttribute('r', 35);
        this.style.filter = 'url(#premiumShadow)';
        outerCircle.setAttribute('r', 40);
        outerCircle.setAttribute('opacity', '0.5');
    });
    
    // 添加点击事件
    circle.addEventListener('click', () => toggleLevel1Node(node));
    
    nodesGroup.appendChild(circle);
    
    // 添加图标
    const iconText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    iconText.setAttribute('x', x);
    iconText.setAttribute('y', y + 6);
    iconText.setAttribute('text-anchor', 'middle');
    iconText.setAttribute('font-size', '22');
    iconText.setAttribute('class', 'node-icon');
    iconText.textContent = node.icon;
    nodesGroup.appendChild(iconText);
    
    // 添加标签
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + 58);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#fff');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('class', 'node-label-main');
    text.textContent = node.name;
    labelsGroup.appendChild(text);
    
    // 英文标签
    const enText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    enText.setAttribute('x', x);
    enText.setAttribute('y', y + 74);
    enText.setAttribute('text-anchor', 'middle');
    enText.setAttribute('fill', 'rgba(255,255,255,0.6)');
    enText.setAttribute('font-size', '9');
    enText.setAttribute('class', 'node-label-sub');
    enText.textContent = node.nameEn.split(' ')[0];
    labelsGroup.appendChild(enText);
}

// 绘制二级节点
function drawLevel2Nodes(level1Node, centerX, centerY) {
    const linksGroup = document.getElementById('links');
    const nodesGroup = document.getElementById('nodes');
    const labelsGroup = document.getElementById('labels');
    
    const level1Angle = (level1Node.angle * Math.PI) / 180;
    const level1Radius = 220; // 与drawLevel1Node保持一致
    const level1X = centerX + level1Radius * Math.cos(level1Angle);
    const level1Y = centerY + level1Radius * Math.sin(level1Angle);
    
    const level2Nodes = knowledgeGraphData.level2[level1Node.id] || [];
    const level2Radius = 160; // 从130增加到160，拉大一级到二级节点的距离
    
    level2Nodes.forEach((node, index) => {
        // 计算二级节点角度（在一级节点周围扇形分布，角度范围加大）
        const baseAngle = level1Node.angle - 50; // 从35增加到50，扩大扇形范围
        const angleStep = 100 / (level2Nodes.length - 1 || 1); // 从70增加到100
        const angle = ((baseAngle + index * angleStep) * Math.PI) / 180;
        
        const x = level1X + level2Radius * Math.cos(angle);
        const y = level1Y + level2Radius * Math.sin(angle);
        
        // 绘制连接线
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', level1X);
        line.setAttribute('y1', level1Y);
        line.setAttribute('x2', x);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', categoryColors[level1Node.category].main);
        line.setAttribute('stroke-width', '2');
        line.setAttribute('opacity', '0.6');
        line.setAttribute('class', 'link-line level2-link');
        linksGroup.appendChild(line);
        
        // 创建外圈光晕
        const glowCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glowCircle.setAttribute('cx', x);
        glowCircle.setAttribute('cy', y);
        glowCircle.setAttribute('r', 30);
        glowCircle.setAttribute('fill', categoryColors[level1Node.category].main);
        glowCircle.setAttribute('opacity', '0.15');
        glowCircle.setAttribute('filter', 'url(#glow)');
        glowCircle.setAttribute('class', 'level2-glow');
        nodesGroup.appendChild(glowCircle);
        
        // 创建节点圆
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 26);
        circle.setAttribute('fill', `url(#${categoryColors[level1Node.category].gradient}L2)`);
        circle.setAttribute('stroke', categoryColors[level1Node.category].light);
        circle.setAttribute('stroke-width', '2.5');
        circle.setAttribute('class', 'node level2-node');
        circle.setAttribute('data-id', node.id);
        circle.style.cursor = 'pointer';
        circle.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        // 添加悬停效果
        circle.addEventListener('mouseenter', function() {
            this.setAttribute('r', 30);
            this.style.filter = 'brightness(1.2)';
            glowCircle.setAttribute('opacity', '0.3');
        });
        circle.addEventListener('mouseleave', function() {
            this.setAttribute('r', 26);
            this.style.filter = 'none';
            glowCircle.setAttribute('opacity', '0.15');
        });
        
        // 添加点击事件
        circle.addEventListener('click', () => {
            showNodeDetails(node);
            drawLevel3Nodes(node, x, y, level1Node.category);
        });
        
        nodesGroup.appendChild(circle);
        
        // 添加标签
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y + 42);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#fff');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-weight', '600');
        text.setAttribute('class', 'node-label-main');
        text.textContent = node.name;
        labelsGroup.appendChild(text);
        
        // 英文标签
        const enText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        enText.setAttribute('x', x);
        enText.setAttribute('y', y + 55);
        enText.setAttribute('text-anchor', 'middle');
        enText.setAttribute('fill', 'rgba(255,255,255,0.5)');
        enText.setAttribute('font-size', '8');
        enText.setAttribute('class', 'node-label-sub');
        enText.textContent = node.nameEn.split(' ')[0];
        labelsGroup.appendChild(enText);
    });
}

// 绘制三级节点
function drawLevel3Nodes(level2Node, parentX, parentY, category) {
    const linksGroup = document.getElementById('links');
    const nodesGroup = document.getElementById('nodes');
    const labelsGroup = document.getElementById('labels');
    
    // 清除之前的三级节点和相关元素
    document.querySelectorAll('.level3-node').forEach(el => el.remove());
    document.querySelectorAll('.level3-link').forEach(el => el.remove());
    document.querySelectorAll('.level3-label').forEach(el => el.remove());
    document.querySelectorAll('.level3-label-sub').forEach(el => el.remove());
    document.querySelectorAll('.level3-glow-outer').forEach(el => el.remove());
    document.querySelectorAll('.level3-glow-inner').forEach(el => el.remove());
    document.querySelectorAll('.flow-particle').forEach(el => el.remove());
    
    const level3Nodes = knowledgeGraphData.level3[level2Node.id] || [];
    if (level3Nodes.length === 0) return;
    
    const level3Radius = 130; // 从90增加到130，拉大二级到三级节点的距离
    const startAngle = -90; // 从-70增加到-90，扩大扇形范围
    const angleStep = 180 / (level3Nodes.length - 1 || 1); // 从140增加到180
    
    level3Nodes.forEach((node, index) => {
        const angle = ((startAngle + index * angleStep) * Math.PI) / 180;
        const x = parentX + level3Radius * Math.cos(angle);
        const y = parentY + level3Radius * Math.sin(angle);
        
        // 绘制动态流动连接线
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', parentX);
        line.setAttribute('y1', parentY);
        line.setAttribute('x2', x);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', categoryColors[category].light);
        line.setAttribute('stroke-width', '2');
        line.setAttribute('opacity', '0.6');
        line.setAttribute('class', 'level3-link flow-line');
        line.setAttribute('stroke-linecap', 'round');
        linksGroup.appendChild(line);
        
        // 创建流动粒子效果
        const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        particle.setAttribute('r', 3);
        particle.setAttribute('fill', categoryColors[category].main);
        particle.setAttribute('class', 'flow-particle');
        particle.style.filter = 'drop-shadow(0 0 4px ' + categoryColors[category].main + ')';
        linksGroup.appendChild(particle);
        
        // 粒子动画
        animateParticle(particle, parentX, parentY, x, y, index * 200);
        
        // 创建多层光晕效果
        const glowCircle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glowCircle1.setAttribute('cx', x);
        glowCircle1.setAttribute('cy', y);
        glowCircle1.setAttribute('r', 28);
        glowCircle1.setAttribute('fill', categoryColors[category].main);
        glowCircle1.setAttribute('opacity', '0.08');
        glowCircle1.setAttribute('class', 'level3-glow-outer');
        nodesGroup.appendChild(glowCircle1);
        
        const glowCircle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glowCircle2.setAttribute('cx', x);
        glowCircle2.setAttribute('cy', y);
        glowCircle2.setAttribute('r', 22);
        glowCircle2.setAttribute('fill', categoryColors[category].light);
        glowCircle2.setAttribute('opacity', '0.15');
        glowCircle2.setAttribute('class', 'level3-glow-inner');
        nodesGroup.appendChild(glowCircle2);
        
        // 创建节点圆 - 使用渐变填充
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 18);
        circle.setAttribute('fill', 'url(#' + categoryColors[category].gradient + 'L3)');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2.5');
        circle.setAttribute('class', 'node level3-node');
        circle.setAttribute('data-id', node.id);
        circle.style.cursor = 'pointer';
        circle.style.filter = 'drop-shadow(0 3px 8px rgba(0,0,0,0.2))';
        
        // 添加悬停效果
        circle.addEventListener('mouseenter', function() {
            this.setAttribute('r', 22);
            this.style.filter = 'drop-shadow(0 6px 16px rgba(0,0,0,0.35)) brightness(1.15)';
            glowCircle1.setAttribute('opacity', '0.2');
            glowCircle1.setAttribute('r', 32);
            glowCircle2.setAttribute('opacity', '0.3');
            glowCircle2.setAttribute('r', 26);
        });
        circle.addEventListener('mouseleave', function() {
            this.setAttribute('r', 18);
            this.style.filter = 'drop-shadow(0 3px 8px rgba(0,0,0,0.2))';
            glowCircle1.setAttribute('opacity', '0.08');
            glowCircle1.setAttribute('r', 28);
            glowCircle2.setAttribute('opacity', '0.15');
            glowCircle2.setAttribute('r', 22);
        });
        
        // 添加点击事件
        circle.addEventListener('click', () => showNodeDetails(node));
        
        nodesGroup.appendChild(circle);
        
        // 添加标签
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y + 34);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#fff');
        text.setAttribute('font-size', '10');
        text.setAttribute('font-weight', '500');
        text.setAttribute('class', 'level3-label');
        text.textContent = node.name;
        labelsGroup.appendChild(text);
        
        // 英文标签
        const enText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        enText.setAttribute('x', x);
        enText.setAttribute('y', y + 46);
        enText.setAttribute('text-anchor', 'middle');
        enText.setAttribute('fill', 'rgba(255,255,255,0.5)');
        enText.setAttribute('font-size', '7');
        enText.setAttribute('class', 'level3-label-sub');
        enText.textContent = node.nameEn.split(' ')[0];
        labelsGroup.appendChild(enText);
    });
}

// 切换一级节点展开状态
function toggleLevel1Node(node) {
    node.expanded = !node.expanded;
    
    if (node.expanded) {
        expandedNodes.add(node.id);
    } else {
        expandedNodes.delete(node.id);
    }
    
    // 重绘图谱（带过渡动画）
    const svg = document.getElementById('knowledgeGraph');
    svg.style.opacity = '0.8';
    setTimeout(() => {
        initGraph();
        svg.style.opacity = '1';
    }, 150);
    
    // 显示节点详情
    showNodeDetails(node);
}

// 显示节点详情
function showNodeDetails(node) {
    const detailPanel = document.getElementById('detailPanel');
    const details = nodeDetails[node.id];
    
    // 添加淡入动画
    detailPanel.style.opacity = '0';
    
    setTimeout(() => {
        if (!details) {
            // 为三级节点生成默认详情
            detailPanel.innerHTML = `
                <div class="detail-content">
                    <div class="detail-header" style="background: ${categoryColors[node.category] ? `linear-gradient(135deg, ${categoryColors[node.category].main}, ${categoryColors[node.category].dark})` : 'linear-gradient(135deg, #ff6b35, #c41e3a)'};">
                        <h2 class="detail-title">${node.name}</h2>
                        <p class="detail-subtitle">${node.nameEn || ''}</p>
                    </div>
                    <div class="detail-body">
                        <div class="detail-section">
                            <h3 class="section-title">简介 / Introduction</h3>
                            <p class="section-content">${node.description || '暂无详细介绍'}</p>
                            ${node.descriptionEn ? `<p class="section-content-en">${node.descriptionEn}</p>` : ''}
                        </div>
                    </div>
                </div>
            `;
        } else {
            let sectionsHTML = details.sections.map(section => `
                <div class="detail-section">
                    <h3 class="section-title">${section.title}</h3>
                    <p class="section-content">${section.content}</p>
                </div>
            `).join('');
            
            detailPanel.innerHTML = `
                <div class="detail-content">
                    <div class="detail-header">
                        <h2 class="detail-title">${details.title}</h2>
                        <p class="detail-subtitle">${details.subtitle}</p>
                    </div>
                    <div class="detail-body">
                        ${sectionsHTML}
                    </div>
                </div>
            `;
        }
        
        // 淡入显示
        detailPanel.style.opacity = '1';
        detailPanel.style.transition = 'opacity 0.3s ease';
    }, 150);
}

// 粒子动画函数
function animateParticle(particle, x1, y1, x2, y2, delay) {
    const duration = 2000; // 2秒完成一次流动
    const startTime = Date.now() + delay;
    
    function update() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = (elapsed % duration) / duration;
        
        // 计算当前位置
        const currentX = x1 + (x2 - x1) * progress;
        const currentY = y1 + (y2 - y1) * progress;
        
        particle.setAttribute('cx', currentX);
        particle.setAttribute('cy', currentY);
        
        // 透明度变化 - 中间亮，两端暗
        const opacity = Math.sin(progress * Math.PI) * 0.8 + 0.2;
        particle.setAttribute('opacity', opacity);
        
        requestAnimationFrame(update);
    }
    
    requestAnimationFrame(update);
}

// 缩放和拖拽状态
let scale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

// 初始化缩放拖拽
function initZoomPan() {
    const svg = document.getElementById('knowledgeGraph');
    const graphCanvas = document.getElementById('graphCanvas');
    
    if (!svg || !graphCanvas) return;
    
    // 鼠标滚轮缩放
    graphCanvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.3, Math.min(3, scale * delta));
        
        // 以鼠标位置为中心缩放
        const rect = svg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 计算新的偏移量，保持鼠标指向的点不变
        translateX = mouseX - (mouseX - translateX) * (newScale / scale);
        translateY = mouseY - (mouseY - translateY) * (newScale / scale);
        scale = newScale;
        
        updateTransform();
    }, { passive: false });
    
    // 鼠标拖拽 - 整个画布都可以拖拽
    graphCanvas.addEventListener('mousedown', (e) => {
        // 排除按钮和交互元素
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        graphCanvas.style.cursor = 'grabbing';
        
        // 阻止默认行为，避免选中文字
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        graphCanvas.style.cursor = 'grab';
    });
    
    // 触摸支持
    let touchStartDistance = 0;
    let touchStartScale = 1;
    
    graphCanvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        } else if (e.touches.length === 2) {
            // 双指缩放
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            touchStartDistance = Math.sqrt(dx * dx + dy * dy);
            touchStartScale = scale;
        }
    }, { passive: false });
    
    graphCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        
        if (e.touches.length === 1 && isDragging) {
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            updateTransform();
        } else if (e.touches.length === 2) {
            // 双指缩放
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            scale = Math.max(0.3, Math.min(3, touchStartScale * (distance / touchStartDistance)));
            updateTransform();
        }
    }, { passive: false });
    
    graphCanvas.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// 更新变换
function updateTransform() {
    const svg = document.getElementById('knowledgeGraph');
    if (svg) {
        svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        svg.style.transformOrigin = '0 0';
    }
}

// 重置视图
function resetView() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initGraph();
    initZoomPan();
    
    // 窗口大小改变时重绘
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initGraph, 200);
    });
    
    // 添加重置按钮
    const graphCanvas = document.getElementById('graphCanvas');
    if (graphCanvas) {
        const resetBtn = document.createElement('button');
        resetBtn.innerHTML = '⟲ 重置视图';
        resetBtn.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background: linear-gradient(135deg, #ff6b35, #c41e3a);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            z-index: 100;
        `;
        resetBtn.addEventListener('mouseenter', () => {
            resetBtn.style.transform = 'scale(1.05)';
            resetBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
        });
        resetBtn.addEventListener('mouseleave', () => {
            resetBtn.style.transform = 'scale(1)';
            resetBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        });
        resetBtn.addEventListener('click', resetView);
        graphCanvas.appendChild(resetBtn);
    }
});

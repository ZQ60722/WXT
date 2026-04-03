// 详情页功能

// 当前语言状态
let currentLang = 'zh';

// 获取URL参数
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取传递的地点参数
    const heritageSite = getUrlParameter('site') || '增城古荔枝园';
    
    // 更新页面内容
    updatePageContent(heritageSite);
    
    // 初始化模态框
    initVoiceModal();
    
    // 初始化语言切换
    initLanguageSwitch();
});

// 初始化语言切换功能
function initLanguageSwitch() {
    const langSwitchBtn = document.getElementById('langSwitchBtn');
    if (langSwitchBtn) {
        langSwitchBtn.addEventListener('click', toggleLanguage);
    }
}

// 切换语言
function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    
    // 更新所有带有 data-zh 和 data-en 属性的元素
    const translatableElements = document.querySelectorAll('[data-zh][data-en]');
    translatableElements.forEach(el => {
        el.textContent = el.getAttribute(`data-${currentLang}`);
    });
    
    // 更新语言按钮显示
    const langCurrent = document.querySelector('.lang-current');
    const langOther = document.querySelector('.lang-other');
    if (langCurrent && langOther) {
        langCurrent.textContent = currentLang === 'zh' ? '中' : 'EN';
        langOther.textContent = currentLang === 'zh' ? 'EN' : '中';
    }
    
    // 更新页面标题
    document.title = currentLang === 'zh' ? '文化遗产详情 - 学术档案' : 'Cultural Heritage Details - Academic Archive';
}

// 初始化模态框功能
function initVoiceModal() {
    const voiceButton = document.getElementById('voiceButton');
    const voiceModal = document.getElementById('voiceModal');
    const closeModal = document.getElementById('closeModal');
    const cancelButton = document.getElementById('cancelButton');
    const voiceForm = document.getElementById('voiceForm');
    
    if (voiceButton && voiceModal) {
        // 打开模态框
        voiceButton.addEventListener('click', function() {
            voiceModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        // 关闭模态框 - 点击关闭按钮
        if (closeModal) {
            closeModal.addEventListener('click', closeVoiceModal);
        }
        
        // 关闭模态框 - 点击取消按钮
        if (cancelButton) {
            cancelButton.addEventListener('click', closeVoiceModal);
        }
        
        // 关闭模态框 - 点击背景
        voiceModal.addEventListener('click', function(e) {
            if (e.target === voiceModal) {
                closeVoiceModal();
            }
        });
        
        // 表单提交
        if (voiceForm) {
            voiceForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleFormSubmit();
            });
        }
    }
}

// 关闭模态框
function closeVoiceModal() {
    const voiceModal = document.getElementById('voiceModal');
    if (voiceModal) {
        voiceModal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// 处理表单提交
function handleFormSubmit() {
    const formData = {
        feeling: document.getElementById('userFeeling').value,
        story: document.getElementById('userStory').value,
        name: document.getElementById('userName').value,
        age: document.getElementById('userAge').value,
        country: document.getElementById('userCountry').value
    };
    
    // 这里可以添加提交到服务器的逻辑
    console.log('提交的数据:', formData);
    
    // 显示成功提示
    const message = currentLang === 'zh' ? '感谢您的分享！' : 'Thank you for sharing!';
    alert(message);
    
    // 关闭模态框并重置表单
    closeVoiceModal();
    document.getElementById('voiceForm').reset();
}

// 更新页面内容
function updatePageContent(siteName) {
    // 可以在这里根据siteName动态更新页面内容
    console.log('当前展示的文化遗产:', siteName);
}

// ESC键关闭模态框
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeVoiceModal();
    }
});

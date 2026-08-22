// ============================================
// JS/sound.js - 全局点击音效控制
// ============================================

(function() {
    'use strict';

    // ---------- 防止重复初始化 ----------
    if (window.__soundFXInitialized) {
        console.log('🔊 点击音效已初始化，跳过重复加载');
        return;
    }

    // ---------- 音效配置（动态路径） ----------
    function getClickFilePath() {
        // 如果在 pages 子目录下
        if (window.location.pathname.includes('/pages/')) {
            return '../audio/click.mp3';
        }
        // 如果在根目录
        return 'audio/click.mp3';
    }

    const CONFIG = {
        clickVolume: 0.3,
        clickFile: getClickFilePath()
    };

    // ---------- 音效对象 ----------
    const SoundFX = {
        click: null,
        enabled: true,
        ready: false
    };

    // ---------- 初始化音效 ----------
    function initSounds() {
        if (SoundFX.ready) return;
        
        try {
            SoundFX.click = new Audio(CONFIG.clickFile);
            SoundFX.click.volume = CONFIG.clickVolume;
            SoundFX.click.preload = 'auto';
            SoundFX.click.load();
            
            SoundFX.ready = true;
            console.log('🔊 点击音效已加载 (音量: ' + (CONFIG.clickVolume * 100) + '%) 路径: ' + CONFIG.clickFile);
        } catch (error) {
            console.warn('⚠️ 音效加载失败:', error.message);
        }
    }

    // ---------- 播放点击音效 ----------
    function playClick() {
        if (!SoundFX.enabled) return;
        
        if (!SoundFX.ready || !SoundFX.click) {
            initSounds();
            if (!SoundFX.click) return;
        }

        try {
            SoundFX.click.currentTime = 0;
            var playPromise = SoundFX.click.play();
            if (playPromise !== undefined) {
                playPromise.catch(function(err) {
                    console.debug('音效播放失败，尝试重新加载:', err.message);
                    SoundFX.click.load();
                    SoundFX.click.play().catch(function() {});
                });
            }
        } catch (error) {
            // 静默处理
        }
    }

    // ---------- 切换音效开关 ----------
    function toggleSound() {
        SoundFX.enabled = !SoundFX.enabled;
        console.log('🔊 点击音效:', SoundFX.enabled ? '已开启' : '已关闭');
        return SoundFX.enabled;
    }

    // ---------- 获取音效状态 ----------
    function isSoundEnabled() {
        return SoundFX.enabled;
    }

    // ---------- 设置音量 ----------
    function setVolume(value) {
        var vol = Math.max(0, Math.min(1, value));
        CONFIG.clickVolume = vol;
        if (SoundFX.click) {
            SoundFX.click.volume = vol;
        }
        console.log('🔊 音效音量已设为:', Math.round(vol * 100) + '%');
    }

    // ============================================
    // 事件绑定
    // ============================================

    function shouldPlaySound(target) {
        if (target.id === 'musicToggle') return false;
        if (target.id === 'soundToggle') return false;
        if (target.id === 'langSwitchBtn') return false;
        if (target.classList && target.classList.contains('scroll-dot')) return false;
        
        var clickable = target.closest('a, button, .cta-button, .ba-btn, .knowledge-graph-btn, .lang-switch-btn, .site-tag, .lz-thumb');
        return clickable !== null;
    }

    function handleClick(e) {
        var target = e.target;
        if (shouldPlaySound(target)) {
            requestAnimationFrame(function() {
                playClick();
            });
        }
    }

    function setupEventListeners() {
        document.removeEventListener('click', handleClick);
        document.addEventListener('click', handleClick);
        console.log('🔊 点击音效事件已绑定');
    }

    // ============================================
    // 初始化
    // ============================================

    function init() {
        window.__soundFXInitialized = true;
        initSounds();
        setupEventListeners();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================
    // 暴露全局接口
    // ============================================

    window.SoundFX = {
        play: playClick,
        toggle: toggleSound,
        enabled: isSoundEnabled,
        setVolume: setVolume,
        reinit: function() {
            SoundFX.ready = false;
            CONFIG.clickFile = getClickFilePath();
            initSounds();
            setupEventListeners();
            console.log('🔊 音效已重新初始化');
        }
    };

    console.log('🔊 音效系统初始化完成');
})();
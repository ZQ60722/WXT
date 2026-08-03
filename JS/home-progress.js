/* ============================================================
   主页滚动叙事触发器 (home-progress.js)
   - IntersectionObserver 观察 .section，进入视口加 .is-active
   - 触发屏内 reveal 动画（CSS 见 style.css 热改层）
   - Section 2 统计数字滚动动画
   纯原生，无依赖；root 为 .container（主页滚动容器）
   ============================================================ */
(function () {
    'use strict';

    var container = document.querySelector('.container');
    if (!container) return;

    // 深链接直达：?s=2 打开时自动滚到第 2 屏（也用于截图验证）
    var q = new URLSearchParams(window.location.search);
    var targetSection = parseInt(q.get('s'), 10);
    if (targetSection >= 1 && targetSection <= 4 && container) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                container.scrollTop = (targetSection - 1) * container.clientHeight;
            }, 400);
        });
    }

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var sections = Array.prototype.slice.call(document.querySelectorAll('.section'));

    /* ---- 1. Section 进入视口 → .is-active（只触发一次） ---- */
    if ('IntersectionObserver' in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-active');
                io.unobserve(entry.target);
            });
        }, { root: container, threshold: 0.55 });
        sections.forEach(function (s) { io.observe(s); });
    } else {
        // 降级：全部直接显示
        sections.forEach(function (s) { s.classList.add('is-active'); });
    }

    /* ---- 2. 统计数字滚动（7691 / 226+ / 1000+） ---- */
    var statNumbers = Array.prototype.slice.call(document.querySelectorAll('.academic-stats .stat-number'));
    if (statNumbers.length && !reduceMotion && 'IntersectionObserver' in window) {
        var statIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                statIO.unobserve(entry.target);
                animateStatNumber(entry.target);
            });
        }, { root: container, threshold: 0.5 });
        statNumbers.forEach(function (n) { statIO.observe(n); });
    }

    function animateStatNumber(el) {
        var raw = el.textContent || '';
        var match = raw.match(/^([\d,]+)(.*)$/);
        if (!match) return;
        var target = parseFloat(match[1].replace(/,/g, ''));
        var suffix = match[2];
        var duration = 1500;
        var start = null;

        function tick(now) {
            if (start === null) start = now;
            var p = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            var val = Math.round(target * eased);
            el.textContent = val.toLocaleString('en-US') + suffix;
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }
})();

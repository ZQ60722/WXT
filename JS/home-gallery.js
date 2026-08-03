/* ============================================================
   主页地图区 · 竖向自动照片画廊 (home-gallery.js)
   - 按 6 个地图点位组织照片（增城/东莞/化州/新会/潮州/梅州）
   - 竖向无缝循环滚动，hover 暂停
   - 点击照片 → 联动地图 marker + 打开 lightbox 大图
   - 点击地图 marker → 画廊同步高亮（双向联动，复用 onMapNodeClick 钩子）
   纯原生，无依赖。在 script.js 之后引入。
   ============================================================ */
(function () {
    'use strict';

    var wall = document.querySelector('.side-image-wall');
    if (!wall) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- 照片数据：按地图点位 index 组织 ---- */
    var SITE = {
        zengcheng: 0, // 增城荔枝
        dongguan: 1,  // 东莞莞香
        huazhou: 2,   // 化州橘红
        xinhui: 3,    // 新会陈皮
        chaozhou: 4,  // 潮州单丛茶
        meizhou: 5    // 梅州灵芝
    };

    // 缺图点位（东莞/化州/新会）用占位，标注待替换
    var photos = [
        // 增城荔枝 (index 0)
        { src: 'img/荔1.jpg',     caption: '漫山红遍', site: SITE.zengcheng },
        { src: 'img/荔枝丰收.jpg', caption: '枝头甜蜜', site: SITE.zengcheng },
        // 潮州单丛茶 (index 4)
        { src: 'img/桑1.jpg',     caption: '桑基鱼塘', site: SITE.chaozhou },
        { src: 'img/桑基鱼塘.jpg',     caption: '桑基鱼塘', site: SITE.chaozhou },
        { src: 'img/tea-bg.jpg',     caption: '茶田的春', site: SITE.chaozhou },
        { src: 'img/凤凰单丛茶.jpg', caption: '凤凰单丛茶', site: SITE.chaozhou },
        // 梅州灵芝 (index 5)
        { src: 'img/灵芝1.jpg',    caption: '梅州灵芝', site: SITE.meizhou },
        { src: 'img/灵芝2.jpg',    caption: '灵芝', site: SITE.meizhou },
        // 东莞莞香 (index 1) / 化州橘红 (index 2) / 新会陈皮 (index 3) — 占位待替换
        { src: 'img/incense-bg.jpg', caption: '东莞莞香', site: SITE.dongguan, placeholder: true },
        { src: 'img/herb-bg.jpg',    caption: '化州橘红', site: SITE.huazhou,  placeholder: true },
        { src: 'img/chenpi-bg.jpg',  caption: '新会陈皮', site: SITE.xinhui,   placeholder: true }
    ];

    /* ---- 渲染画廊（无缝循环：克隆首张追加到尾部） ---- */
    function renderGallery() {
        wall.innerHTML = '';
        wall.classList.add('gallery-active');

        var track = document.createElement('div');
        track.className = 'gallery-track';
        if (!reduceMotion) track.classList.add('gallery-anim');

        photos.forEach(function (photo, i) {
            var item = document.createElement('div');
            item.className = 'gallery-item' + (photo.placeholder ? ' placeholder' : '');
            item.setAttribute('data-site-index', photo.site);
            item.setAttribute('data-photo-index', i);

            var img = document.createElement('img');
            img.src = photo.src;
            img.alt = photo.caption;
            img.loading = 'lazy';

            var cap = document.createElement('div');
            cap.className = 'gallery-caption';
            cap.textContent = photo.caption;
            if (photo.placeholder) {
                var ph = document.createElement('span');
                ph.className = 'gallery-ph';
                ph.textContent = '待替换';
                cap.appendChild(ph);
            }

            item.appendChild(img);
            item.appendChild(cap);

            // 点击：联动地图 + 大图
            item.addEventListener('click', function () {
                selectSite(photo.site);
                openLightbox(i);
            });

            track.appendChild(item);
        });

        // 无缝循环：克隆首 3 张到尾部
        for (var k = 0; k < Math.min(3, photos.length); k++) {
            var clone = track.children[k].cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
        }

        wall.appendChild(track);

        // hover 暂停
        wall.addEventListener('mouseenter', function () { track.classList.add('paused'); });
        wall.addEventListener('mouseleave', function () { track.classList.remove('paused'); });
    }

    /* ---- 联动：点击照片 → 触发对应 marker ---- */
    function selectSite(siteIndex) {
        var markers = document.querySelectorAll('.map-marker');
        var marker = markers[siteIndex];
        if (marker) marker.click(); // 复用现有 click：清 active + updateLocationCard + onMapNodeClick
    }

    /* ---- 双向联动：地图 marker 点击 → 画廊高亮 ---- */
    function syncGallery(siteIndex) {
        var items = wall.querySelectorAll('.gallery-item:not(.clone)');
        items.forEach(function (it) {
            var on = String(it.getAttribute('data-site-index')) === String(siteIndex);
            it.classList.toggle('active', on);
        });
        // 让该组照片滚动到可见区（简单起见高亮即可，滚动留给滚动动画）
    }

    // 订阅预留钩子（script.js 在地图 marker 点击时调用）
    var origHook = window.onMapNodeClick;
    window.onMapNodeClick = function (site, index) {
        if (typeof origHook === 'function') origHook(site, index);
        syncGallery(index);
    };

    // 初始：高亮默认选中（增城）
    var initIndex = 0;
    var initMarker = document.querySelector('.map-marker.active');
    if (initMarker) {
        var idx = parseInt(initMarker.getAttribute('data-index'), 10);
        if (!isNaN(idx)) initIndex = idx;
    }
    syncGallery(initIndex);

    /* ---- Lightbox 大图查看器 ---- */
    var lb = null;

    function openLightbox(startIndex) {
        var all = wall.querySelectorAll('.gallery-item:not(.clone)');
        if (!all.length) return;
        var cur = startIndex % all.length;

        lb = document.createElement('div');
        lb.className = 'gallery-lightbox';
        lb.innerHTML =
            '<div class="lb-inner">' +
            '  <img class="lb-img" alt="">' +
            '  <div class="lb-caption"></div>' +
            '  <button class="lb-close" aria-label="关闭">&times;</button>' +
            '  <button class="lb-prev" aria-label="上一张">&lsaquo;</button>' +
            '  <button class="lb-next" aria-label="下一张">&rsaquo;</button>' +
            '</div>';
        document.body.appendChild(lb);

        function show(i) {
            var item = all[i];
            var img = lb.querySelector('.lb-img');
            img.src = item.querySelector('img').src;
            img.alt = item.querySelector('img').alt;
            lb.querySelector('.lb-caption').textContent =
                item.querySelector('.gallery-caption').textContent.replace('待替换', '');
            var btn = lb.querySelector('.lb-next');
            btn.style.display = (i < all.length - 1) ? 'block' : 'none';
        }
        show(cur);

        lb.querySelector('.lb-close').addEventListener('click', closeLb);
        lb.querySelector('.lb-prev').addEventListener('click', function () {
            cur = (cur - 1 + all.length) % all.length;
            show(cur);
        });
        lb.querySelector('.lb-next').addEventListener('click', function () {
            if (cur < all.length - 1) { cur++; show(cur); }
        });
        lb.addEventListener('click', function (e) {
            if (e.target === lb) closeLb();
        });
        document.addEventListener('keydown', lbKey);
    }

    function lbKey(e) {
        if (e.key === 'Escape') closeLb();
        else if (e.key === 'ArrowLeft') lb.querySelector('.lb-prev').click();
        else if (e.key === 'ArrowRight') lb.querySelector('.lb-next').click();
    }

    function closeLb() {
        if (!lb) return;
        document.removeEventListener('keydown', lbKey);
        lb.remove();
        lb = null;
    }

    /* ---- 照片墙显隐：仅第 2 部分显示（由滚动位置实时驱动） ---- */
    var scrollCtl = document.querySelector('.container');
    var S2_INDEX = 1; // 第 2 个 section（0 基）

    function updateVisibility() {
        if (!scrollCtl) return;
        var h = scrollCtl.clientHeight || window.innerHeight;
        var idx = Math.round(scrollCtl.scrollTop / h);
        // 只在第 2 部分且处于活跃区时显示（允许轻微边界）
        var near = Math.abs(scrollCtl.scrollTop - S2_INDEX * h) < h * 0.25;
        var on = (idx === S2_INDEX) || near;
        document.body.classList.toggle('map-sec-active', on);
    }

    scrollCtl.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    updateVisibility(); // 初始

    /* ---- 启动 ---- */
    // 等地图 marker 初始化完成后再渲染（script.js 用 setTimeout 500ms init）
    function boot() {
        if (document.querySelectorAll('.map-marker').length) {
            renderGallery();
        } else {
            setTimeout(boot, 150);
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();

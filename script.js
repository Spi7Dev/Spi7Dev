/* ============================================
   SPi7.DEV — SCRIPT
   Horizontal Slider · Browser Detection · Animations
   ============================================ */

(function () {

    /* ─── STATE ──────────────────────────── */
    let currentIndex = 0;
    const TOTAL_SLIDES = 4;

    const track       = document.getElementById('sliderTrack');
    const prevBtn     = document.getElementById('prevBtn');
    const nextBtn     = document.getElementById('nextBtn');
    const indicators  = document.querySelectorAll('.indicator');
    const counterEl   = document.getElementById('counterCurrent');
    const labelEl     = document.getElementById('indicatorLabel');

    const SLIDE_LABELS = ['Home', 'Project Alpha', 'Beta Dashboard', 'Contact'];

    /* ─── BROWSER DETECTION ──────────────── */
    function detectBrowser() {
        const ua  = navigator.userAgent;
        const nav = navigator;
        if (ua.includes('Edg/'))                    return { name: 'Edge',    fa: 'fa-edge' };
        if (ua.includes('Firefox/'))                return { name: 'Firefox', fa: 'fa-firefox-browser' };
        if (ua.includes('OPR/') || ua.includes('Opera/')) return { name: 'Opera', fa: 'fa-opera' };
        if (nav.brave || ua.includes('Brave'))      return { name: 'Brave',   fa: 'fa-shield-alt' };
        if (ua.includes('Chrome/'))                 return { name: 'Chrome',  fa: 'fa-chrome' };
        return { name: 'Chrome', fa: 'fa-chrome' };
    }

    function applyBrowserBtn(iconId, textId, btnId) {
        const browser = detectBrowser();
        const iconEl  = document.getElementById(iconId);
        const textEl  = document.getElementById(textId);
        if (iconEl) { iconEl.className = `fab ${browser.fa}`; }
        if (textEl) { textEl.textContent = `Download for ${browser.name}`; }
    }

    applyBrowserBtn('heroIcon',  'heroText',   'heroInstallBtn');
    applyBrowserBtn('alphaIcon', 'alphaText',  'alphaInstallBtn');
    applyBrowserBtn('betaIcon',  'betaText',   'betaInstallBtn');

    /* ─── SLIDE WIDTH ────────────────────── */
    function getSlideStep() {
        const peek = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--peek')) || 80;
        const gap  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--slide-gap')) || 24;
        return (window.innerWidth - peek) + gap;
    }

    /* ─── GO TO SLIDE ────────────────────── */
    function goTo(index, animate) {
        index = Math.max(0, Math.min(TOTAL_SLIDES - 1, index));

        // Toggle animation
        if (animate === false) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.85s cubic-bezier(0.77, 0, 0.175, 1)';
        }

        const offset = index * getSlideStep();
        track.style.transform = `translateX(-${offset}px)`;
        currentIndex = index;

        updateUI();
        triggerSlideAnimations(index);
    }

    /* ─── UPDATE UI ──────────────────────── */
    function updateUI() {
        // Counter
        if (counterEl) counterEl.textContent = String(currentIndex + 1).padStart(2, '0');

        // Label
        if (labelEl) labelEl.textContent = SLIDE_LABELS[currentIndex] || '';

        // Indicators
        indicators.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        // Arrows
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === TOTAL_SLIDES - 1;

        // Nav links active state
        document.querySelectorAll('.nav-links a[data-slide]').forEach(a => {
            const si = parseInt(a.getAttribute('data-slide'));
            a.style.color = si === currentIndex ? 'var(--accent)' : '';
        });
    }

    /* ─── SLIDE ANIMATIONS ───────────────── */
    function triggerSlideAnimations(index) {
        // Reset all slides
        document.querySelectorAll('.slide').forEach(slide => {
            slide.classList.remove('active');
        });

        // Activate current slide (triggers CSS transitions)
        const currentSlide = document.getElementById(`slide-${index}`);
        if (currentSlide) {
            // Force reflow so transitions re-fire on revisit
            currentSlide.querySelectorAll('.anim-reveal').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(22px)';
            });
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    currentSlide.classList.add('active');
                });
            });
        }
    }

    /* ─── ARROW BUTTONS ──────────────────── */
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));

    /* ─── INDICATORS ─────────────────────── */
    indicators.forEach(dot => {
        dot.addEventListener('click', () => {
            const i = parseInt(dot.getAttribute('data-index'));
            goTo(i);
        });
    });

    /* ─── NAVBAR SLIDE LINKS ─────────────── */
    document.querySelectorAll('[data-slide]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const i = parseInt(el.getAttribute('data-slide'));
            goTo(i);
        });
    });

    /* ─── KEYBOARD ───────────────────────── */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  goTo(currentIndex + 1);
        if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    goTo(currentIndex - 1);
    });

    /* ─── TOUCH / SWIPE ──────────────────── */
    let touchStartX = null;
    let touchStartY = null;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (touchStartX === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
            if (dx < 0) goTo(currentIndex + 1);
            else        goTo(currentIndex - 1);
        }
        touchStartX = null;
        touchStartY = null;
    }, { passive: true });

    /* ─── TRACKPAD WHEEL ─────────────────── */
    let wheelLocked = false;
    document.addEventListener('wheel', (e) => {
        if (wheelLocked) return;

        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (Math.abs(delta) < 20) return; // ignore small movements

        if (delta > 0) goTo(currentIndex + 1);
        else           goTo(currentIndex - 1);

        wheelLocked = true;
        setTimeout(() => { wheelLocked = false; }, 900);
    }, { passive: true });

    /* ─── RESIZE ─────────────────────────── */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            goTo(currentIndex, false);
        }, 100);
    });

    /* ─── GHOST BTN (explore) ────────────── */
    const exploreBtn = document.getElementById('heroExplore');
    if (exploreBtn) exploreBtn.addEventListener('click', () => goTo(1));

    /* ─── CONTACT FORM ───────────────────── */
    window.handleFormSubmit = function (e) {
        e.preventDefault();
        const btn = e.target.querySelector('.pill-btn');
        const label = btn.querySelector('.pill-label');
        const original = label.textContent;

        btn.style.pointerEvents = 'none';
        label.textContent = 'Message Sent ✓';
        btn.style.background = '#28c840';

        setTimeout(() => {
            label.textContent = original;
            btn.style.background = '';
            btn.style.pointerEvents = '';
            e.target.reset();
        }, 3000);
    };

    /* ─── INIT ───────────────────────────── */
    goTo(0, false);

    // Small delay so first slide animates in on load
    setTimeout(() => {
        triggerSlideAnimations(0);
    }, 100);

})();

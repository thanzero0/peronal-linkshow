document.addEventListener('DOMContentLoaded', () => {

    // ── Year ─────────────────────────────────────────────────────────────────
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── Toast ─────────────────────────────────────────────────────────────────
    const toast        = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    function showToast(msg) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    // Copy on right-click / long-press
    const emailBtn = document.getElementById('email-btn');
    if (emailBtn) {
        emailBtn.addEventListener('contextmenu', e => {
            e.preventDefault();
            navigator.clipboard.writeText('thanzero@gmail.com')
                .then(() => showToast('Email copied!'));
        });
    }

    const phoneBtn = document.getElementById('phone-btn');
    if (phoneBtn) {
        phoneBtn.addEventListener('contextmenu', e => {
            e.preventDefault();
            navigator.clipboard.writeText('085198197271')
                .then(() => showToast('Phone copied!'));
        });
    }

    // ── Light / Dark Mode Toggle ──────────────────────────────────────────────
    const bwToggle  = document.getElementById('bw-toggle');
    const THEME_KEY = 'linkshow-theme';

    // Restore saved preference
    const savedTheme = localStorage.getItem(THEME_KEY);
    let isLight = savedTheme === 'light';
    if (isLight) document.body.classList.add('light-mode');

    function applyTheme(light) {
        isLight = light;
        document.body.classList.toggle('light-mode', light);
        localStorage.setItem(THEME_KEY, light ? 'light' : 'dark');
        // re-render glow immediately with correct colour
        renderGlow(currentX, currentY);
    }

    if (bwToggle) {
        bwToggle.addEventListener('click', () => {
            applyTheme(!isLight);
        });
    }

    // ── Interactive Background Glow (follows cursor / touch) ─────────────────
    const bgGlow = document.getElementById('bg-glow');

    let targetX = 50, targetY = 50;   // where we want the glow (% of viewport)
    let currentX = 50, currentY = 50; // smoothed position

    function getGlowGradient(x, y) {
        if (document.body.classList.contains('light-mode')) {
            // Blue — light mode
            return `radial-gradient(circle 650px at ${x}% ${y}%,
                        rgba(37,99,235,0.15) 0%,
                        rgba(59,130,246,0.07) 45%,
                        transparent 70%)`;
        } else {
            // Red — dark mode
            return `radial-gradient(circle 650px at ${x}% ${y}%,
                        rgba(239,68,68,0.16) 0%,
                        rgba(180,30,30,0.07) 45%,
                        transparent 70%)`;
        }
    }

    function renderGlow(x, y) {
        if (!bgGlow) return;
        bgGlow.style.background = getGlowGradient(x, y);
    }

    // Smooth animation loop (lerp)
    function animationLoop() {
        currentX += (targetX - currentX) * 0.07;
        currentY += (targetY - currentY) * 0.07;
        renderGlow(currentX, currentY);
        requestAnimationFrame(animationLoop);
    }
    animationLoop();

    // Mouse tracking
    document.addEventListener('mousemove', e => {
        targetX = (e.clientX / window.innerWidth)  * 100;
        targetY = (e.clientY / window.innerHeight) * 100;
        resetIdle();
    });

    // Touch tracking
    document.addEventListener('touchmove', e => {
        const t = e.touches[0];
        targetX = (t.clientX / window.innerWidth)  * 100;
        targetY = (t.clientY / window.innerHeight) * 100;
        resetIdle();
    }, { passive: true });

    // ── Screensaver — blank after 30 s idle ──────────────────────────────────
    const screensaver = document.getElementById('screensaver');
    const IDLE_MS     = 60000; // 1 menit
    let   idleTimer   = null;
    let   ssActive    = false;

    function showSS() {
        if (!screensaver || ssActive) return;
        ssActive = true;
        screensaver.setAttribute('aria-hidden', 'false');
        screensaver.classList.add('active');
    }

    function hideSS() {
        if (!screensaver || !ssActive) return;
        ssActive = false;
        screensaver.setAttribute('aria-hidden', 'true');
        screensaver.classList.remove('active');
    }

    function resetIdle() {
        if (ssActive) hideSS();
        clearTimeout(idleTimer);
        idleTimer = setTimeout(showSS, IDLE_MS);
    }

    // Any interaction resets the idle timer
    ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(evt =>
        document.addEventListener(evt, resetIdle, { passive: true })
    );

    // Tap / click screensaver to dismiss
    if (screensaver) {
        screensaver.addEventListener('click',      hideSS);
        screensaver.addEventListener('touchstart', hideSS, { passive: true });
    }

    // Kick off idle timer on page load
    resetIdle();
});

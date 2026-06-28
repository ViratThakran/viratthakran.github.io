/* ── PAGE LOAD TRANSITION ─────────────────── */
const pt = document.getElementById('page-transition');

function ptIn(cb) {
    pt.style.pointerEvents = 'all';
    document.body.classList.add('pt-in');
    document.body.classList.remove('pt-out');
    setTimeout(cb || (() => {}), 700);
}
function ptOut() {
    document.body.classList.add('pt-out');
    document.body.classList.remove('pt-in');
    setTimeout(() => {
        pt.style.pointerEvents = 'none';
        document.body.classList.remove('pt-out');
    }, 800);
}

window.addEventListener('load', () => {
    pt.style.pointerEvents = 'none';
    document.body.classList.add('pt-in');
    requestAnimationFrame(() => requestAnimationFrame(() => {
        setTimeout(() => ptOut(), 120);
    }));
});

/* ── CURSOR GLOW ─────────────────────────── */
const glow = document.getElementById('cursor-glow');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let gx = mx, gy = my;
window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animGlow() {
    gx += (mx - gx) * 0.07;
    gy += (my - gy) * 0.07;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animGlow);
})();

/* ── CLICK RIPPLE ────────────────────────── */
document.addEventListener('click', e => {
    const r = document.createElement('div');
    Object.assign(r.style, {
        position:'fixed', left: e.clientX+'px', top: e.clientY+'px',
        width:'6px', height:'6px', borderRadius:'50%',
        background:'rgba(242,85,65,0.6)', transform:'translate(-50%,-50%) scale(0)',
        pointerEvents:'none', zIndex:'9998',
        transition:'transform 0.6s ease, opacity 0.6s ease',
        boxShadow: '0 0 0 0 rgba(242,85,65,0.4)'
    });
    document.body.appendChild(r);
    requestAnimationFrame(() => {
        r.style.transform = 'translate(-50%,-50%) scale(40)';
        r.style.opacity   = '0';
    });
    setTimeout(() => r.remove(), 700);
});

/* ── FLOATING PARTICLES ──────────────────── */
for (let i = 0; i < 45; i++) {
    const p = document.createElement('div');
    p.className = 'particle' + (Math.random() < 0.18 ? ' accent-dot' : '');
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration  = (16 + Math.random() * 24) + 's';
    p.style.animationDelay     = Math.random() * 22 + 's';
    const sz = (1 + Math.random() * 2).toFixed(1) + 'px';
    p.style.width = sz; p.style.height = sz;
    document.body.appendChild(p);
}

/* ── SCROLL REVEAL ───────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── COUNTERS ────────────────────────────── */
const countObs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target, dur = 2200, start = performance.now();
    countObs.unobserve(el);
    (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const cur  = Math.floor(ease * target);
        el.textContent = target === 60 ? cur + '%' : target >= 1000 ? cur.toLocaleString() + '+' : cur + '+';
        if (p < 1) requestAnimationFrame(tick);
    })(start);
}, { threshold: 0.5 });
document.querySelectorAll('.counter-num').forEach(el => countObs.observe(el));

/* ── FAQ ─────────────────────────────────── */
function toggleFaq(btn) {
    const item = btn.parentElement;
    const active = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active'));
    if (!active) item.classList.add('active');
}

/* ── NAV TRANSITION ────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const href = a.getAttribute('href');
        const target = document.querySelector(href);
        if (!target) return;
        if (a.classList.contains('nav-link') || a.classList.contains('pill-btn')) {
            ptIn(() => {
                target.scrollIntoView({ behavior: 'instant', block: 'start' });
                setTimeout(() => ptOut(), 60);
            });
        } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ── CARD 3D TILT ────────────────────────── */
document.querySelectorAll('.work-card, .skill-card, .edu-card, .counter-item').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `translateY(-6px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
        card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
    });
});

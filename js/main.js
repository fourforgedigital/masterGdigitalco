/* Master G Digital Co. - site behaviour.
   Sections are numbered; search for a heading to find the part you want.
   Needs: index.html (element ids / classes) and images/ (logo + work photos). */

// ===== 1. HELPERS =====
// $(css) = all matches, q(css) = first match
const $ = s => document.querySelectorAll(s), q = s => document.querySelector(s);

// ===== 2. CLIENTS ROWS =====
// CLIENTS list: [name, work we did, industry label, optional star rating 1-5, optional quote]. Add
// the rating and quote ONLY when a real client has given them.
const R = [
    [
        'Gagan Masale', 'Product ad series for Sabut Masala, Coriander, Turmeric and Red Chilli powders.', 'FMCG · Spices'
    ], [
        'Sikkim Trading Company', 'All-in-one trading partner ad covering equity, derivatives, MTF and more. Hisar, Haryana.', 'Stock Market · Trading'
    ], [
        'PPT Fleet Service Pvt. Ltd.', 'Fleet options, airport pickup and corporate trust ad creatives for Delhi NCR and Gurgaon.', 'Travel · Corporate Cabs'
    ], [
        'Dr. Bhuvnesh Narayan Purohit', 'Clinic awareness ad series for a medical oncologist, in Hindi and English. Bikaner.', 'Healthcare'
    ], [
        'Pt. Tri Vikram Vyas', 'Adhik Maas awareness and kundli consultation poster for an astrologer.', 'Spiritual · Astrology'
    ], [
        'Bikaner Ward Campaigns', 'Candidate posters for municipal ward election campaigns in Bikaner.', 'Political Campaigns'
    ], [
        'Community Festival Greeting', 'Milad-un-Nabi greeting poster for a local community leader.', 'Festival · Greetings'
    ]
];
// Build the 3 scrolling rows (each row repeats its cards twice for a seamless loop)
$('.tk').forEach((t, r) => {
    const h = [0, 1, 2, 3, 4].map(k => R[(r * 2 + k) % 7]).map(x => `<div class="rv2"><div class="st">${x[2]}</div>${x[3] ? `<div class="sr">${'★'.repeat(x[3])}${'☆'.repeat(5 - x[3])}</div>` : ''}<b>${x[0]}</b><p>${x[4] ? '“' + x[4] + '”' : x[1]}</p>${x[4] ? '<small>' + x[1] + '</small>' : ''}</div>`).join('');
    t.innerHTML = h + h;
});

// ===== 3. POINTER EFFECTS (mouse / touch) =====
// Shared element references and device flags
const g = q('#glow'), w = q('#wipe'), nav = q('#nav'), cur = q('#cur'), fine = matchMedia('(pointer:fine)').matches, red = matchMedia('(prefers-reduced-motion:reduce)').matches;
// Cursor glow + custom cursor ring follow the pointer
addEventListener('pointermove', e => {
    g.style.setProperty('--x', e.clientX + 'px');
    g.style.setProperty('--y', e.clientY + 'px');
    if (fine) {
        cur.style.display = 'block';
        cur.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
        cur.classList.toggle('h', !!e.target.closest('a,button,.card,input,textarea'));
    }
});
// 3D tilt and gradient glow on cards
$('.card').forEach(c => {
    c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        c.style.setProperty('--mx', x + 'px');
        c.style.setProperty('--my', y + 'px');
        if (fine) {
            c.style.setProperty('--ry', (x / r.width - .5) * 8 + 'deg');
            c.style.setProperty('--rx', (.5 - y / r.height) * 8 + 'deg');
        }
    });
    c.addEventListener('pointerleave', () => {
        c.style.setProperty('--rx', '0deg');
        c.style.setProperty('--ry', '0deg');
    });
});
// Magnetic buttons
$('.btn').forEach(b => {
    b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)`;
    });
    b.addEventListener('pointerleave', () => b.style.transform = '');
});

// ===== 4. SCROLL REVEAL, COUNTERS, MENU STATE =====
// Animated number counter (also fills its progress bar)
function cnt(n) {
    if (n.d)
        return;
    n.d = 1;
    const t = +n.dataset.n, s = performance.now(), bi = n.parentElement.querySelector('[data-w]');
    (function f(x) {
        const p = Math.min((x - s) / 2200, 1), e = 1 - Math.pow(1 - p, 3);
        n.textContent = Math.round(t * e).toLocaleString('en-US') + (p == 1 ? n.dataset.s : '');
        if (bi)
            bi.style.width = e * bi.dataset.w + '%';
        if (p < 1)
            requestAnimationFrame(f);
    })(s);
}
// Reveal .rv elements when they scroll into view and start counters
const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
        const t = e.target;
        t.classList.add('on');
        if (t.classList.contains('tag'))
            scr(t);
        t.querySelectorAll('[data-n]').forEach(cnt);
        io.unobserve(t);
    }
}), { threshold: .15 });
// Stagger the reveal delay and start observing
$('.rv').forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * .1 + 's';
    io.observe(el);
});
// Highlight the menu link of the section currently on screen
const so = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
        $('.links a').forEach(a => a.classList.toggle('act', a.getAttribute('href') == '#' + e.target.id));
        mv(q('.links a.act'));
    }
}), { rootMargin: '-45% 0px -50% 0px' });
$('section').forEach(s => so.observe(s));
// Scroll progress bar at the top
addEventListener('scroll', () => q('#bar').style.width = scrollY / (document.documentElement.scrollHeight - innerHeight) * 100 + '%', { passive: true });
// Hamburger button opens / closes the mobile menu
q('#bg').onclick = () => nav.classList.toggle('open');

// ===== 5. PROCESS TIMELINE =====
// Elements for the Process timeline line
const pli = q('.pl i'), prc = q('#process');
// Fill the timeline line as the Process section scrolls
function ex() {
    const b = prc.getBoundingClientRect();
    pli.style.width = Math.min(100, Math.max(0, (innerHeight * .8 - b.top) / (b.height * .8) * 100)) + '%';
}
// Run on scroll and resize
addEventListener('scroll', ex, { passive: true });
addEventListener('resize', ex);
ex();

// ===== 6. SMALL EFFECTS =====
// Text scramble for the small section labels
function scr(el) {
    const o = el.textContent, ch = '01<>/_#$%', s = performance.now();
    (function f(x) {
        const p = Math.min((x - s) / 700, 1);
        el.textContent = o.split('').map((c, i) => c == ' ' || i < p * o.length ? c : ch[Math.random() * ch.length | 0]).join('');
        if (p < 1)
            requestAnimationFrame(f);
    })(s);
}
// Cursor shows "VIEW" over gallery photos
document.addEventListener('pointerover', e => {
    cur.dataset.t = e.target.closest('.pj') ? 'VIEW' : '';
});

// ===== 7. WORK GALLERY =====
// Image path helper (photos live in images/work/)
const img = k => `images/work/${k}.jpg`;
// PROJECT LIST. To add work: copy a line, change title (t), category label (c), filter key (f),
// note (n) and photos (g = [[fileName, caption], ...]).
const PJ = [
    {
        t: 'Gagan Masale', c: 'FMCG', f: 'fmcg', n: 'Spice brand ad series', g: [
            ['gagan-turmeric-dark', 'Turmeric Powder \u00b7 Dark'], ['gagan-sabut-masala', 'Sabut Masala'], ['gagan-coriander', 'Coriander Powder'], ['gagan-turmeric', 'Turmeric Powder'], ['gagan-red-chilli', 'Red Chilli Powder'], ['gagan-sabut-masala-chef', 'Sabut Masala \u00b7 Chef']
        ]
    },
    {
        t: 'Master G Digital Co.', c: 'Agency', f: 'own', n: 'Meta Ads lead generation creative', g: [['master-g-promo']]
    },
    {
        t: 'Municipal Election Campaigns', c: 'Political', f: 'pol', n: 'Ward-level campaign posters', g: [
            ['ward-62-campaign', 'Ward 62 Campaign'], ['ward-60-campaign', 'Ward 60 Campaign'], ['ward-2-campaign', 'Ward 2 Campaign']
        ]
    },
    {
        t: 'Sikkim Trading Company', c: 'Business', f: 'biz', n: 'Financial services ad', g: [['sikkim-trading']]
    },
    {
        t: 'Oncology Clinic Ads', c: 'Healthcare', f: 'med', n: 'Doctor clinic ad series', g: [
            ['clinic-ad-hindi', 'Clinic Ad · Hindi'], ['clinic-ad-square', 'Clinic Ad · Square'], ['clinic-ad-teal-poster', 'Clinic Ad · Teal Poster'], ['clinic-ad-blue-poster', 'Clinic Ad · Blue Poster']
        ]
    },
    {
        t: 'PPT Fleet Service', c: 'Travel', f: 'trv', n: 'Corporate fleet and airport transfer ads', g: [
            ['ppt-fleet-options', 'Fleet Options'], ['ppt-airport-pickup', 'Airport Pickup & Drop'], ['ppt-corporate-trust', 'Corporate Trust']
        ]
    },
    {
        t: 'Astrology Consultation', c: 'Spiritual', f: 'spi', n: 'Adhik Maas awareness poster', g: [['astrology-adhik-maas']]
    },
    {
        t: 'Milad-un-Nabi Greeting', c: 'Festival', f: 'fes', n: 'Festival greeting poster', g: [['milad-un-nabi-greeting']]
    }
];
// Container for the gallery
const gal = q('#pg');
// Render each group (heading + all its photos)
gal.innerHTML = PJ.map((p, gi) => `<div class="gr" data-f="${p.f}"><div class="gh"><span>${p.c}</span><h3>${p.t}</h3><p>${p.n} · ${p.g.length} ${p.g.length > 1 ? 'designs' : 'design'}</p></div><div class="gg${p.g.length == 1 ? ' one' : ''}">${p.g.map((x, n) => `<figure class="pj" data-g="${gi}" data-n="${n}"><img data-k="${x[0]}" alt="${x[1] || p.t}" decoding="async"><figcaption class="pi"><p>${x[1] || p.t}</p></figcaption></figure>`).join('')}</div></div>`).join('');
// Set each photo source
$('#pg img').forEach(i => i.src = img(i.dataset.k));
// Filter tabs show / hide groups
q('#flt').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b)
        return;
    $('#flt button').forEach(x => x.classList.toggle('on', x === b));
    $('.gr').forEach(c => c.style.display = (b.dataset.f == 'all' || c.dataset.f == b.dataset.f) ? '' : 'none');
});

// ===== 8. LIGHTBOX =====
// Lightbox state: photos of the open group and the current position
const lb = q('#lb'), li = q('#li');
let LG = [], LI = 0;
// Show the current photo
function sh() {
    li.src = img(LG[LI].k);
    li.style.animation = 'none';
    void li.offsetWidth;
    li.style.animation = '';
    q('#lc').textContent = LG[LI].t + (LG.length > 1 ? '  \u00b7  ' + (LI + 1) + ' / ' + LG.length : '');
    $('.ln').forEach(b => b.style.display = LG.length > 1 ? '' : 'none');
}
// Close the lightbox
function cl() {
    lb.classList.remove('on');
    document.body.style.overflow = '';
}
// Go to the next / previous photo
function nx(d) {
    LI = (LI + d + LG.length) % LG.length;
    sh();
}
// Click a photo to open it
gal.addEventListener('click', e => {
    const c = e.target.closest('.pj');
    if (!c)
        return;
    const p = PJ[c.dataset.g];
    LG = p.g.map(x => ({ k: x[0], t: x[1] || p.t }));
    LI = +c.dataset.n;
    sh();
    lb.classList.add('on');
    document.body.style.overflow = 'hidden';
});
// Lightbox buttons; click outside the photo to close
q('#lx').onclick = cl;
q('#lp').onclick = () => nx(-1);
q('#ln').onclick = () => nx(1);
lb.addEventListener('click', e => {
    if (e.target === lb)
        cl();
});
// Keyboard: Esc, left and right arrows
addEventListener('keydown', e => {
    if (!lb.classList.contains('on'))
        return;
    if (e.key == 'Escape')
        cl();
    if (e.key == 'ArrowRight')
        nx(1);
    if (e.key == 'ArrowLeft')
        nx(-1);
});
// Swipe left / right on touch screens
let tx = 0;
lb.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
lb.addEventListener('touchend', e => {
    const d = e.changedTouches[0].clientX - tx;
    if (Math.abs(d) > 50 && LG.length > 1)
        nx(d < 0 ? 1 : -1);
});

// ===== 9. DARK / LIGHT THEME =====
// Load the saved choice (default is light)
const th = q('#th'), rt = document.documentElement;
let sv = null;
try {
    sv = localStorage.getItem('mg-theme');
}
catch (e) {
}
// Apply a theme
function st(t) {
    rt.setAttribute('data-theme', t);
    th.setAttribute('aria-pressed', t == 'dark');
}
st(sv || 'light');
// Toggle the theme and remember it
th.onclick = () => {
    rt.classList.add('tt');
    const n = rt.dataset.theme == 'dark' ? 'light' : 'dark';
    st(n);
    try {
        localStorage.setItem('mg-theme', n);
    }
    catch (e) {
    }
    setTimeout(() => rt.classList.remove('tt'), 700);
};

// ===== 10. SCROLL-LINKED EFFECTS =====
// Split the manifesto sentence into words; grab the founder photo
const mw = q('#mf');
mw.innerHTML = mw.textContent.trim().split(' ').map(w => `<span>${w}</span>`).join(' ');
const ms = [...mw.children], ph = q('.ph'), pg = q('.ph img'), chs = [...$('.chip')];
// Light up manifesto words and move the founder photo while scrolling
function sc() {
    const r = mw.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (innerHeight * .55)));
    ms.forEach((s, i) => s.classList.toggle('on', i < p * ms.length));
    const b = ph.getBoundingClientRect();
    pg.style.setProperty('--py', (b.top + b.height / 2 - innerHeight / 2) * -.06 + 'px');
}
addEventListener('scroll', sc, { passive: true });
sc();
// Hero floating chips move slightly with the mouse
q('#hero').addEventListener('pointermove', e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    chs.forEach((c, i) => c.style.translate = `${x * (i + 1) * -24}px ${y * (i + 1) * -24}px`);
});

// ===== 11. MENU RIBBON + PAGE TRANSITIONS =====
// Sliding highlight pill behind the menu links
const hl = q('.hl'), lk = [...$('.links a:not(.cta)')];
function mv(a) {
    hl.style.opacity = a && innerWidth > 980 ? 1 : 0;
    lk.forEach(x => x.classList.toggle('hv', x === a));
    if (a) {
        hl.style.left = a.offsetLeft + 'px';
        hl.style.width = a.offsetWidth + 'px';
    }
}
// Move the pill on hover; return to the active link on leave
lk.forEach(a => a.addEventListener('pointerenter', () => mv(a)));
q('.links').addEventListener('pointerleave', () => mv(q('.links a.act')));
addEventListener('resize', () => mv(q('.links a.act')));
// Gradient wipe when clicking an in-page link
$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const t = q(a.getAttribute('href'));
    nav.classList.remove('open');
    w.className = 'in';
    setTimeout(() => {
        t.scrollIntoView({ behavior: 'instant' });
        w.className = 'out';
        setTimeout(() => w.className = '', 600);
    }, 560);
}));

// ===== 12. HERO + CONTACT =====
// Rotating word in the hero line ("We master ADS_")
const W = ['ADS', 'REELS', 'BRANDS', 'GROWTH', 'LEADS'], ro = q('#rot');
let wi = 0;
setInterval(() => {
    ro.style.opacity = 0;
    ro.style.transform = 'translateY(8px)';
    setTimeout(() => {
        ro.textContent = W[++wi % 5];
        ro.style.opacity = 1;
        ro.style.transform = '';
    }, 300);
}, 2200);
// Contact form opens WhatsApp with the message pre-filled
q('#fm').onsubmit = e => {
    e.preventDefault();
    const f = e.target.elements, m = `Hi Master G Digital Co., I'm ${f[0].value} (${f[1].value}). ${f[2].value}`;
    window.open('https://wa.me/917023629103?text=' + encodeURIComponent(m), '_blank');
    q('#ok').textContent = 'Opening WhatsApp to send your message...';
    e.target.reset();
};

// ===== 13. HERO PARTICLE NETWORK (canvas) =====
// Canvas setup and colors
const cv = q('#cv'), cx = cv.getContext('2d'), hero = q('#hero'), C = ['#1e4bff', '#7b2ff7', '#ff2d9b', '#ff8a1f'];
let CW, CH, P = [], mx = -999, my = -999;
// Create dots to fit the hero size
function rs() {
    const r = hero.getBoundingClientRect();
    CW = cv.width = r.width;
    CH = cv.height = r.height;
    P = Array.from({ length: Math.min(60, CW / 20 | 0) }, () => ({
        x: Math.random() * CW, y: Math.random() * CH, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5, c: C[Math.random() * 4 | 0]
    }));
}
// Track the mouse inside the hero
hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
});
// Draw one frame: move dots and push them away from the mouse
function dr() {
    cx.clearRect(0, 0, CW, CH);
    for (const p of P) {
        if (!red) {
            p.x += p.vx;
            p.y += p.vy;
        }
        if (p.x < 0 || p.x > CW)
            p.vx *= -1;
        if (p.y < 0 || p.y > CH)
            p.vy *= -1;
        const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy) || 1;
        if (d < 140) {
            p.x += dx / d * 1.6;
            p.y += dy / d * 1.6;
        }
        cx.fillStyle = p.c;
        cx.beginPath();
        cx.arc(p.x, p.y, 2.4, 0, 6.3);
        cx.fill();
    }
    // Connect nearby dots with lines
    for (let i = 0; i < P.length; i++)
        for (let j = i + 1; j < P.length; j++) {
            const a = P[i], b = P[j], d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 125) {
                cx.strokeStyle = a.c;
                cx.globalAlpha = (1 - d / 125) * .28;
                cx.beginPath();
                cx.moveTo(a.x, a.y);
                cx.lineTo(b.x, b.y);
                cx.stroke();
                cx.globalAlpha = 1;
            }
        }
    // Keep animating only while the hero is near the top
    if (!red && scrollY < innerHeight * 1.2)
        requestAnimationFrame(dr);
    else if (!red)
        setTimeout(() => requestAnimationFrame(dr), 300);
}
// Start the animation
rs();
dr();
addEventListener('resize', rs);

// ===== 14. LOADING + TYPING =====
// Typing animation for the company name in the menu
const TP = [['.k', 'MASTER '], ['.gb', 'G'], ['.d', 'DIGITAL CO.']];
(async () => {
    const sl = ms => new Promise(r => setTimeout(r, ms));
    await sl(1800);
    for (const [s, t] of TP) {
        const el = q('#tp ' + s);
        el.after(q('.cr'));
        for (const c of t) {
            el.textContent += c;
            await sl(red ? 0 : 95);
        }
    }
})();
// Loading screen percentage counter
let pn = 0;
const pi = setInterval(() => {
    q('#pc').textContent = Math.min(100, ++pn);
    if (pn >= 100)
        clearInterval(pi);
}, 14);
// Hide the loading screen once the page has loaded
addEventListener('load', () => setTimeout(() => q('#intro').classList.add('h'), 1000));

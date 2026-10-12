/* Master G Digital Co. - site behaviour.
   Sections are numbered; search a heading to jump to it. */

const $ = (s, c = document) => [...c.querySelectorAll(s)];   // all matches
const q = (s, c = document) => c.querySelector(s);           // first match

// ===== 1. SETTINGS =====
const WHATSAPP = '917023629103';   // contact form sends messages to this number
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const img = k => `images/work/${k}.jpg`;   // work photos live in images/work/

// ===== 2. CONTENT LISTS (edit these to add clients / projects) =====
// CLIENTS: [name, work we did, industry label, optional star rating 1-5, optional quote]
// Add a rating and quote ONLY when a real client has given them.
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

// WORK PROJECTS: t = title, c = label, f = filter key, n = note,
// g = photos [[fileName, caption], ...] (files are in images/work/)
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

// ===== 3. LOADING SCREEN =====
const loader = q('#loader');
addEventListener('load', () => setTimeout(() => loader.classList.add('done'), reduceMotion ? 0 : 900));

// ===== 4. NAVIGATION =====
const nav = q('#nav'), burger = q('#burger');
// open / close the mobile menu
burger.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  burger.setAttribute('aria-expanded', open);
});
$('#menu a').forEach(a => a.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  burger.setAttribute('aria-expanded', false);
}));
// highlight the link of the section currently on screen
const spy = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) {
    const id = '#' + e.target.id;
    $('#menu a, .rail a').forEach(a => a.classList.toggle('act', a.getAttribute('href') === id));
  }
}), { rootMargin: '-45% 0px -50% 0px' });
$('main section[id]').forEach(s => spy.observe(s));

// ===== 5. REVEAL ON SCROLL + COUNTERS =====
const reveal = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('on'); reveal.unobserve(e.target); }
}), { threshold: .12 });
$('.rv').forEach((el, i) => { el.style.setProperty('--d', (i % 4) * .08 + 's'); reveal.observe(el); });

// number counter (4.5 s) that also fills its thin meter
function count(el) {
  const target = +el.dataset.n, suffix = el.dataset.s || '';
  const meter = el.closest('.stat').querySelector('[data-w]');
  const start = performance.now(), duration = reduceMotion ? 1 : 4500;
  (function tick(now) {
    const p = Math.min((now - start) / duration, 1), e = 1 - (1 - p) * (1 - p);   // ease-out
    el.textContent = Math.round(target * e).toLocaleString('en-US') + (p === 1 ? suffix : '');
    if (meter) meter.style.width = e * meter.dataset.w + '%';
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const counters = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { count(e.target); counters.unobserve(e.target); }
}), { threshold: .6 });
$('[data-n]').forEach(el => counters.observe(el));

// ===== 6. SCROLL-LINKED EFFECTS (progress bar, manifesto words, process line) =====
const bar = q('#bar'), mf = q('#mf'), pline = q('.pline i'), process = q('#process');
mf.innerHTML = mf.textContent.trim().split(' ').map(w => `<span class="w">${w}</span>`).join(' ');
const words = [...mf.children];
let ticking = false;
function onScroll() {
  nav.classList.toggle('stuck', scrollY > 20);
  bar.style.width = scrollY / (document.documentElement.scrollHeight - innerHeight) * 100 + '%';
  // manifesto words light up as the sentence scrolls through the screen
  const r = mf.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (innerHeight * .5)));
  words.forEach((w, i) => w.classList.toggle('on', i < p * words.length));
  // process line fills while the section scrolls by
  const b = process.getBoundingClientRect();
  pline.style.width = Math.min(100, Math.max(0, (innerHeight * .8 - b.top) / (b.height * .7) * 100)) + '%';
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

// ===== 7. CROSSING RIBBONS =====
// Two bands move in opposite directions. Scrolling speeds them up and skews the text;
// scrolling back up reverses them. Change base speed with `base` (pixels per second).
const ribs = $('.rt').map(el => {
  el.innerHTML = el.innerHTML.repeat(4);   // repeat the words so the loop never shows a gap
  el.innerHTML += el.innerHTML;
  return { el, dir: +el.dataset.dir, x: 0 };
});
const base = 70;
let lastY = scrollY, vel = 0, flow = 1, lastT = performance.now(), ribbonsVisible = true;
new IntersectionObserver(e => ribbonsVisible = e[0].isIntersecting).observe(q('#ribbons'));
function ribbonLoop(now) {
  const dt = Math.min((now - lastT) / 1000, .05);
  lastT = now;
  const dy = scrollY - lastY;
  lastY = scrollY;
  vel += (Math.abs(dy) - vel) * .1;                       // smoothed scroll speed
  if (dy !== 0) flow += ((dy > 0 ? 1 : -1) - flow) * .15; // smoothed scroll direction
  if (ribbonsVisible) {
    const skew = -flow * Math.min(vel * .5, 10);
    ribs.forEach(r => {
      const half = r.el.scrollWidth / 2;
      r.x += r.dir * flow * (base + vel * 18) * dt;
      if (r.x <= -half) r.x += half;
      if (r.x > 0) r.x -= half;
      r.el.style.transform = `translate3d(${r.x}px,0,0) skewX(${skew}deg)`;
    });
  }
  requestAnimationFrame(ribbonLoop);
}
if (!reduceMotion) requestAnimationFrame(ribbonLoop);

// ===== 7B. HERO TYPING LINE ("We master ADS / REELS / GROWTH / REACH ...") =====
const rot = q('#rot');
const heroWords = ['ADS', 'REELS', 'GROWTH', 'REACH', 'BRANDS', 'LEADS'];   // edit the words here
if (reduceMotion) {
  rot.textContent = heroWords[0];
} else {
  let wi = 0, ci = 0, deleting = false;
  (function type() {
    const word = heroWords[wi];
    rot.textContent = word.slice(0, ci);
    let delay = deleting ? 55 : 110;                       // typing / deleting speed
    if (!deleting && ci === word.length) { deleting = true; delay = 1400; }   // pause on the full word
    else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % heroWords.length; delay = 350; }
    ci += deleting ? -1 : 1;
    setTimeout(type, delay);
  })();
}

// ===== 8. CLIENTS ROWS =====
// each row shows 5 clients and repeats them twice for a seamless loop
$('.track').forEach((t, r) => {
  const html = [0, 1, 2, 3, 4].map(k => R[(r * 2 + k) % R.length]).map(x => `
    <div class="client">
      <div class="st">${x[2]}</div>
      ${x[3] ? `<div class="sr">${'\u2605'.repeat(x[3])}${'\u2606'.repeat(5 - x[3])}</div>` : ''}
      <b>${x[0]}</b>
      <p>${x[4] ? '\u201c' + x[4] + '\u201d' : x[1]}</p>
      ${x[4] ? '<small>' + x[1] + '</small>' : ''}
    </div>`).join('');
  t.innerHTML = html + html;
});

// ===== 9. WORK GALLERY =====
const gal = q('#gal');
// render each group: heading + all its photos
gal.innerHTML = PJ.map((p, gi) => `
  <div class="gr" data-f="${p.f}">
    <div class="gh"><h3>${p.t}</h3><span>${p.c}</span><p>${p.n} \u00b7 ${p.g.length} ${p.g.length > 1 ? 'designs' : 'design'}</p></div>
    <div class="gg${p.g.length === 1 ? ' one' : ''}">
      ${p.g.map((x, n) => `<figure class="pj" data-g="${gi}" data-n="${n}"><img src="${img(x[0])}" alt="${x[1] || p.t}" loading="lazy" decoding="async"><figcaption class="pi"><p>${x[1] || p.t}</p></figcaption></figure>`).join('')}
    </div>
  </div>`).join('');

// "All" view: one cover card per project (the other tabs show every design)
const ov = q('#ov');
ov.innerHTML = PJ.map((p, gi) => `
  <figure class="pc${p.g.length > 1 ? ' multi' : ''}" data-g="${gi}">
    <div class="pc-img"><img src="${img(p.g[0][0])}" alt="${p.t}" loading="lazy" decoding="async"><span class="pc-cta">View ${p.g.length > 1 ? p.g.length + ' designs' : 'design'} &rarr;</span></div>
    <figcaption class="pc-meta"><div><span>${p.c}</span><h3>${p.t}</h3></div><b>${p.g.length}</b></figcaption>
  </figure>`).join('');
gal.style.display = 'none';   // hidden until a category tab is chosen

// filter tabs: "All" shows the cover cards, any other tab shows all designs of that category
q('#tabs').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  const showAll = b.dataset.f === 'all';
  $('#tabs button').forEach(x => x.classList.toggle('on', x === b));
  ov.style.display = showAll ? '' : 'none';
  gal.style.display = showAll ? 'none' : '';
  $('.gr').forEach(g => g.style.display = (showAll || g.dataset.f === b.dataset.f) ? '' : 'none');
});

// ===== 10. LIGHTBOX =====
const lb = q('#lb'), li = q('#li');
let LG = [], LI = 0;   // photos of the open group, current position
function show() {
  li.src = img(LG[LI].k);
  li.style.animation = 'none'; void li.offsetWidth; li.style.animation = '';
  q('#lc').textContent = LG[LI].t + (LG.length > 1 ? `  \u00b7  ${LI + 1} / ${LG.length}` : '');
  $('#lp, #ln').forEach(b => b.style.display = LG.length > 1 ? '' : 'none');
}
const closeLb = () => { lb.classList.remove('on'); document.body.style.overflow = ''; };
const step = d => { LI = (LI + d + LG.length) % LG.length; show(); };
// open a project in the lightbox, starting at photo number n
function openGroup(gi, n) {
  const p = PJ[gi];
  LG = p.g.map(x => ({ k: x[0], t: x[1] || p.t }));
  LI = n;
  show(); lb.classList.add('on'); document.body.style.overflow = 'hidden';
}
gal.addEventListener('click', e => {      // a photo inside a category view
  const c = e.target.closest('.pj');
  if (c) openGroup(+c.dataset.g, +c.dataset.n);
});
ov.addEventListener('click', e => {       // a cover card in the "All" view
  const c = e.target.closest('.pc');
  if (c) openGroup(+c.dataset.g, 0);
});
q('#lx').onclick = closeLb;
q('#lp').onclick = () => step(-1);
q('#ln').onclick = () => step(1);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
addEventListener('keydown', e => {
  if (!lb.classList.contains('on')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowRight') step(1);
  if (e.key === 'ArrowLeft') step(-1);
});
let touchX = 0;   // swipe on touch screens
lb.addEventListener('touchstart', e => touchX = e.touches[0].clientX, { passive: true });
lb.addEventListener('touchend', e => {
  const d = e.changedTouches[0].clientX - touchX;
  if (Math.abs(d) > 50 && LG.length > 1) step(d < 0 ? 1 : -1);
});

// ===== 11. CONTACT FORM (opens WhatsApp with the message ready) =====
q('#fm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target.elements;
  const msg = `Hi Master G Digital Co., I'm ${f[0].value} (${f[1].value}). ${f[2].value}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
  q('#ok').textContent = 'Opening WhatsApp to send your message...';
  e.target.reset();
});

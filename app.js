/* ==========================================================================
   Lysogenix Therapeutics Inc. — Interactive Scripts & Data Visualizations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderAndNav();
  initScrollReveal();
  initHeroCanvas();
  initMechanismSwitcher();
  initPreclinicalTabs();
  renderAllCharts();
  initLightbox();
  initContactForm();

  const yr = document.getElementById('yearNow');
  if (yr) yr.textContent = new Date().getFullYear();
});

/* -------------------- Header, Mobile Menu & Scroll Spy -------------------- */
function initHeaderAndNav() {
  const header = document.getElementById('siteHeader');
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks.querySelectorAll('a[href^="#"]');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 28);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  links.forEach((a) => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Active nav highlight on scroll
  const sections = Array.from(links)
    .map((l) => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) =>
            l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`)
          );
        }
      });
    },
    { rootMargin: '-38% 0px -52% 0px' }
  );
  sections.forEach((s) => spy.observe(s));
}

/* -------------------- Reveal on Scroll -------------------- */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  els.forEach((el) => io.observe(el));
}

/* -------------------- Ambient Molecular Hero Canvas -------------------- */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let w, h, nodes;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    const count = Math.min(44, Math.max(18, Math.floor((w * h) / 28000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: 1.4 + Math.random() * 2.1,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 145) {
          ctx.strokeStyle = `rgba(201, 166, 107, ${(1 - dist / 145) * 0.22})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = 'rgba(227, 199, 144, 0.58)';
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', resize);
  step();
}

/* -------------------- Interactive ER Stress / UPR Mechanism -------------------- */
function initMechanismSwitcher() {
  const tabs = document.querySelectorAll('.mech-tab');
  const outcome = document.getElementById('pathwayOutcome');

  const states = {
    disease: {
      grp78:
        'Mild reticular staining in untreated AHNs; insufficient adaptive folding capacity under chronic GM2 ganglioside storage burden.',
      badgeAtf6: { text: 'Cytosolic / Mild', cls: '' },
      descAtf6:
        'Mild reticular cytosolic staining in untreated hexb-/- AHNs limits adaptive chaperone transcription.',
      badgeIre1: { text: 'Sparse Nuclear', cls: '' },
      descIre1:
        'Sparse nuclear XBP1 staining impairs ER-associated degradation and protein folding homeostasis.',
      badgePerk: { text: 'Intense p-eIF2α', cls: 'danger' },
      descPerk:
        'Intense reticular p-eIF2α drives chronic CHOP activation, triggering apoptotic cleavage of Caspase-7.',
      protected: false,
      icon: '!',
      kicker: 'DOWNSTREAM CELLULAR OUTCOME (UNTREATED)',
      title: 'Nuclear c-Cas7 Apoptosis & Motor Neuron Loss',
      desc: 'Heavy nuclear cleaved Caspase-7 localization leads to loss of ChAT-positive cholinergic anterior horn neurons, skeletal muscle myofibril atrophy, neuromuscular decline, and premature mortality.',
    },
    treated: {
      grp78:
        'Increased GRP78 upregulation restores ER protein-folding capacity and buffers lysosomal storage stress in spinal cord motor neurons.',
      badgeAtf6: { text: 'Nuclear Shift ↑', cls: 'good' },
      descAtf6:
        '4-PBA induces robust ATF6 elevation and a shift from cytosolic to nuclear localization, activating protective ER quality-control genes.',
      badgeIre1: { text: 'Elevated XBP1 ↑', cls: 'good' },
      descIre1:
        'Increased nuclear XBP1 staining bolsters adaptive ER homeostasis and chaperone expression in anterior horn neurons.',
      badgePerk: { text: 'Reduced p-eIF2α ↓', cls: 'good' },
      descPerk:
        'Marked reduction in maladaptive p-eIF2α staining suppresses pro-apoptotic CHOP / cleaved Caspase-7 signaling.',
      protected: true,
      icon: '✓',
      kicker: 'DOWNSTREAM CELLULAR OUTCOME (4-PBA TREATED)',
      title: 'Cholinergic Motor Neuron Preservation & Lifespan Extension',
      desc: 'Nuclear c-Cas7 apoptosis drops dramatically, ChAT-positive motor neurons and muscle myofibril cross-sections are preserved, and treated hexb-/- mice achieve significantly improved motor endurance and lifespan (P < 0.0008).',
    },
  };

  function applyState(key) {
    const s = states[key];
    document.getElementById('descGrp78').textContent = s.grp78;

    const bAtf6 = document.getElementById('badgeAtf6');
    bAtf6.textContent = s.badgeAtf6.text;
    bAtf6.className = `arm-badge ${s.badgeAtf6.cls}`;
    document.getElementById('descAtf6').textContent = s.descAtf6;

    const bIre1 = document.getElementById('badgeIre1');
    bIre1.textContent = s.badgeIre1.text;
    bIre1.className = `arm-badge ${s.badgeIre1.cls}`;
    document.getElementById('descIre1').textContent = s.descIre1;

    const bPerk = document.getElementById('badgePerk');
    bPerk.textContent = s.badgePerk.text;
    bPerk.className = `arm-badge ${s.badgePerk.cls}`;
    document.getElementById('descPerk').textContent = s.descPerk;

    outcome.classList.toggle('protected', s.protected);
    document.getElementById('outcomeIcon').textContent = s.icon;
    document.getElementById('outcomeKicker').textContent = s.kicker;
    document.getElementById('outcomeTitle').textContent = s.title;
    document.getElementById('outcomeDesc').textContent = s.desc;
  }

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      applyState(btn.dataset.state);
    });
  });
}

/* -------------------- Preclinical Data Tabs -------------------- */
function initPreclinicalTabs() {
  const tabs = document.querySelectorAll('.data-tab');
  const panels = document.querySelectorAll('.data-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      panels.forEach((p) => p.classList.toggle('active', p.id === `panel-${target}`));
    });
  });
}

/* -------------------- Custom SVG Scientific Charts -------------------- */
function renderAllCharts() {
  renderSurvivalChart();
  renderWireHangChart();
  renderCcas7Chart();
  renderMuscleChart();
  renderMarketChart();
}

// 1. Kaplan-Meier Survival Curve (Slide 17: Days 115–155, Probability 0–100%, P < 0.0008)
function renderSurvivalChart() {
  const el = document.getElementById('chartSurvival');
  if (!el) return;
  const W = 520, H = 290;
  const m = { t: 26, r: 24, b: 46, l: 54 };
  const pw = W - m.l - m.r;
  const ph = H - m.t - m.b;
  const xScale = (d) => m.l + ((d - 116) / (154 - 116)) * pw;
  const yScale = (p) => m.t + ph - (p / 105) * ph;

  // Step-curve coordinates faithful to Slide 17 Kaplan-Meier plot
  const wtPts = [[116, 100], [152, 100]];
  const koPts = [
    [116, 100], [122, 100], [122, 86], [123, 86], [123, 72],
    [124, 72], [124, 58], [127, 58], [127, 43], [130, 43],
    [130, 28], [131, 28], [131, 14], [136, 14], [136, 0]
  ];
  const pbaPts = [
    [116, 100], [139, 100], [139, 88], [140, 88], [140, 75],
    [141, 75], [141, 63], [142, 63], [142, 50], [143, 50],
    [143, 38], [144, 38], [144, 0]
  ];

  const toPath = (pts) =>
    pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${xScale(x).toFixed(1)},${yScale(y).toFixed(1)}`).join(' ');

  const xTicks = [120, 130, 140, 150];
  const yTicks = [0, 50, 100];

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Kaplan-Meier survival curve showing P less than 0.0008 lifespan extension with 4-PBA">
      ${yTicks.map((y) => `
        <line x1="${m.l}" y1="${yScale(y)}" x2="${W - m.r}" y2="${yScale(y)}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,4"/>
        <text x="${m.l - 10}" y="${yScale(y) + 4}" text-anchor="end" fill="#b6ada0" font-family="JetBrains Mono" font-size="11">${y}%</text>
      `).join('')}
      ${xTicks.map((x) => `
        <line x1="${xScale(x)}" y1="${m.t}" x2="${xScale(x)}" y2="${m.t + ph}" stroke="rgba(255,255,255,0.05)"/>
        <text x="${xScale(x)}" y="${H - 22}" text-anchor="middle" fill="#b6ada0" font-family="JetBrains Mono" font-size="11">${x}</text>
      `).join('')}

      <line x1="${m.l}" y1="${m.t}" x2="${m.l}" y2="${m.t + ph}" stroke="rgba(201,166,107,0.35)" />
      <line x1="${m.l}" y1="${m.t + ph}" x2="${W - m.r}" y2="${m.t + ph}" stroke="rgba(201,166,107,0.35)" />

      <!-- Shaded survival gain zone between median untreated (127d) and 4-PBA (142d) -->
      <rect x="${xScale(127)}" y="${yScale(100)}" width="${xScale(142) - xScale(127)}" height="${yScale(0) - yScale(100)}" fill="rgba(227,199,144,0.07)" />
      <line x1="${xScale(127)}" y1="${yScale(50)}" x2="${xScale(142)}" y2="${yScale(50)}" stroke="#e3c790" stroke-width="1.2" stroke-dasharray="3,3" />
      <text x="${(xScale(127) + xScale(142)) / 2}" y="${yScale(50) - 7}" text-anchor="middle" fill="#e3c790" font-family="JetBrains Mono" font-size="10.5">+15d shift</text>

      <!-- Curves -->
      <path d="${toPath(wtPts)}" fill="none" stroke="#4ad4a2" stroke-width="2.6" />
      <path d="${toPath(koPts)}" fill="none" stroke="#eb6a6a" stroke-width="2.4" stroke-dasharray="5,4" />
      <path d="${toPath(pbaPts)}" fill="none" stroke="#e3c790" stroke-width="3" />

      <!-- Significance bracket -->
      <path d="M${xScale(123)},${m.t - 4} L${xScale(123)},${m.t - 11} L${xScale(140)},${m.t - 11} L${xScale(140)},${m.t - 4}" fill="none" stroke="#e3c790" stroke-width="1.3" />
      <text x="${(xScale(123) + xScale(140)) / 2}" y="${m.t - 15}" text-anchor="middle" fill="#e3c790" font-family="JetBrains Mono" font-size="10.5" font-weight="600">P &lt; 0.0008</text>

      <!-- Axis Titles -->
      <text x="${m.l + pw / 2}" y="${H - 4}" text-anchor="middle" fill="#b6ada0" font-family="Plus Jakarta Sans" font-size="11.5">Age (Days)</text>
      <text x="15" y="${m.t + ph / 2}" text-anchor="middle" fill="#b6ada0" font-family="Plus Jakarta Sans" font-size="11.5" transform="rotate(-90 15 ${m.t + ph / 2})">Probability of Survival</text>
    </svg>
  `;
}

// 2. Wire Hang Neuromuscular Performance (Slide 17: Weeks 8–21, Time 0–120s)
function renderWireHangChart() {
  const el = document.getElementById('chartWireHang');
  if (!el) return;
  const W = 520, H = 290;
  const m = { t: 26, r: 24, b: 46, l: 54 };
  const pw = W - m.l - m.r;
  const ph = H - m.t - m.b;
  const xScale = (wk) => m.l + ((wk - 8) / (22 - 8)) * pw;
  const yScale = (sec) => m.t + ph - (sec / 132) * ph;

  const wt = [[8,120],[9,120],[10,120],[11,120],[12,120],[13,120],[14,120],[15,120],[16,120],[17,120],[18,120],[19,120],[20,120],[21,120]];
  const ko = [[8,120],[9,120],[10,120],[11,120],[12,120],[13,120],[14,104],[15,14],[16,10],[17,9],[18,8],[19,4]];
  const pba = [[8,120],[9,120],[10,120],[11,120],[12,120],[13,120],[14,120],[15,120],[16,112],[17,98],[18,74],[19,60],[20,54],[21,44]];

  const toPath = (pts) =>
    pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${xScale(x).toFixed(1)},${yScale(y).toFixed(1)}`).join(' ');

  const xTicks = [10, 15, 20];
  const yTicks = [0, 50, 100, 120];

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Wire-hang neuromuscular endurance showing sustained motor function with 4-PBA">
      ${yTicks.map((y) => `
        <line x1="${m.l}" y1="${yScale(y)}" x2="${W - m.r}" y2="${yScale(y)}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,4"/>
        <text x="${m.l - 10}" y="${yScale(y) + 4}" text-anchor="end" fill="#b6ada0" font-family="JetBrains Mono" font-size="11">${y}s</text>
      `).join('')}
      ${xTicks.map((x) => `
        <line x1="${xScale(x)}" y1="${m.t}" x2="${xScale(x)}" y2="${m.t + ph}" stroke="rgba(255,255,255,0.05)"/>
        <text x="${xScale(x)}" y="${H - 22}" text-anchor="middle" fill="#b6ada0" font-family="JetBrains Mono" font-size="11">Wk ${x}</text>
      `).join('')}

      <line x1="${m.l}" y1="${m.t}" x2="${m.l}" y2="${m.t + ph}" stroke="rgba(201,166,107,0.35)" />
      <line x1="${m.l}" y1="${m.t + ph}" x2="${W - m.r}" y2="${m.t + ph}" stroke="rgba(201,166,107,0.35)" />

      <!-- Area under 4-PBA gain -->
      <path d="${toPath(wt)}" fill="none" stroke="#4ad4a2" stroke-width="2.4" />
      <path d="${toPath(ko)}" fill="none" stroke="#eb6a6a" stroke-width="2.4" stroke-dasharray="4,4" />
      <path d="${toPath(pba)}" fill="none" stroke="#e3c790" stroke-width="3" />

      ${ko.slice(6).map(([x, y]) => `<circle cx="${xScale(x)}" cy="${yScale(y)}" r="3.2" fill="#eb6a6a" />`).join('')}
      ${pba.slice(7).map(([x, y]) => `<circle cx="${xScale(x)}" cy="${yScale(y)}" r="3.6" fill="#e3c790" stroke="#181512" stroke-width="1.2" />`).join('')}

      <!-- Callout annotation -->
      <text x="${xScale(17.5)}" y="${yScale(42)}" text-anchor="middle" fill="#eb6a6a" font-family="Plus Jakarta Sans" font-size="10.5">Untreated collapse</text>
      <text x="${xScale(19.2)}" y="${yScale(82)}" text-anchor="middle" fill="#e3c790" font-family="Plus Jakarta Sans" font-size="10.5" font-weight="600">4-PBA preserved</text>

      <text x="${m.l + pw / 2}" y="${H - 4}" text-anchor="middle" fill="#b6ada0" font-family="Plus Jakarta Sans" font-size="11.5">Age (Week)</text>
      <text x="15" y="${m.t + ph / 2}" text-anchor="middle" fill="#b6ada0" font-family="Plus Jakarta Sans" font-size="11.5" transform="rotate(-90 15 ${m.t + ph / 2})">Hang Time (s)</text>
    </svg>
  `;
}

// 3. Nuclear c-Cas7 Positive Cells/mm² (Slide 13: KO ~220 ± 55 vs 4-PBA KO ~16 ± 26, **)
function renderCcas7Chart() {
  const el = document.getElementById('chartCcas7');
  if (!el) return;
  const W = 440, H = 235;
  const m = { t: 36, r: 28, b: 44, l: 58 };
  const pw = W - m.l - m.r;
  const ph = H - m.t - m.b;
  const yScale = (v) => m.t + ph - (v / 320) * ph;

  const bars = [
    { label: 'hexb-/- (KO)', val: 220, err: 52, color: '#eb6a6a', x: m.l + pw * 0.28 },
    { label: '4-PBA hexb-/-', val: 16, err: 24, color: '#e3c790', x: m.l + pw * 0.72 },
  ];
  const bw = 74;

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Bar chart showing significant reduction in nuclear cleaved caspase-7 positive cells with 4-PBA">
      ${[0, 100, 200, 300].map((v) => `
        <line x1="${m.l}" y1="${yScale(v)}" x2="${W - m.r}" y2="${yScale(v)}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,4"/>
        <text x="${m.l - 10}" y="${yScale(v) + 4}" text-anchor="end" fill="#b6ada0" font-family="JetBrains Mono" font-size="11">${v}</text>
      `).join('')}

      <line x1="${m.l}" y1="${m.t}" x2="${m.l}" y2="${m.t + ph}" stroke="rgba(201,166,107,0.35)" />
      <line x1="${m.l}" y1="${m.t + ph}" x2="${W - m.r}" y2="${m.t + ph}" stroke="rgba(201,166,107,0.35)" />

      ${bars.map((b) => {
        const yTop = yScale(b.val);
        const yErrTop = yScale(b.val + b.err);
        return `
          <rect x="${b.x - bw / 2}" y="${yTop}" width="${bw}" height="${yScale(0) - yTop}" rx="6" fill="${b.color}" fill-opacity="0.88" />
          <line x1="${b.x}" y1="${yTop}" x2="${b.x}" y2="${yErrTop}" stroke="#faf6ef" stroke-width="1.8" />
          <line x1="${b.x - 14}" y1="${yErrTop}" x2="${b.x + 14}" y2="${yErrTop}" stroke="#faf6ef" stroke-width="1.8" />
          <text x="${b.x}" y="${yErrTop - 8}" text-anchor="middle" fill="#faf6ef" font-family="JetBrains Mono" font-size="11">~${b.val}</text>
          <text x="${b.x}" y="${H - 18}" text-anchor="middle" fill="#f4efe6" font-family="Plus Jakarta Sans" font-size="12" font-weight="600">${b.label}</text>
        `;
      }).join('')}

      <!-- ** Significance Bracket -->
      <path d="M${bars[0].x},${m.t - 2} L${bars[0].x},${m.t - 12} L${bars[1].x},${m.t - 12} L${bars[1].x},${m.t - 2}" fill="none" stroke="#e3c790" stroke-width="1.5" />
      <text x="${(bars[0].x + bars[1].x) / 2}" y="${m.t - 16}" text-anchor="middle" fill="#e3c790" font-family="JetBrains Mono" font-size="13" font-weight="700">** (&gt;90% reduction)</text>

      <text x="15" y="${m.t + ph / 2}" text-anchor="middle" fill="#b6ada0" font-family="Plus Jakarta Sans" font-size="11" transform="rotate(-90 15 ${m.t + ph / 2})">c-Cas7+ Cells / mm²</text>
    </svg>
  `;
}

// 4. Muscle Bundle Cross-Section Area (Slide 16: Day 80 & Day 120)
function renderMuscleChart() {
  const el = document.getElementById('chartMuscle');
  if (!el) return;
  const W = 500, H = 310;
  const m = { t: 48, r: 24, b: 48, l: 60 };
  const pw = W - m.l - m.r;
  const ph = H - m.t - m.b;
  const yScale = (v) => m.t + ph - (v / 1550) * ph;

  // Values read directly from Slide 16 bar plot
  const groups = [
    {
      age: '80 Days',
      cx: m.l + pw * 0.27,
      bars: [
        { val: 1090, err: 105, color: '#4ad4a2' }, // hexb+/+
        { val: 580, err: 55, color: '#eb6a6a' },   // hexb-/-
        { val: 950, err: 110, color: '#e3c790' },  // 4-PBA hexb-/-
      ],
      topLabel: 'ns',
      leftSig: '**',
      rightSig: '****',
    },
    {
      age: '120 Days',
      cx: m.l + pw * 0.74,
      bars: [
        { val: 1140, err: 100, color: '#4ad4a2' },
        { val: 690, err: 85, color: '#eb6a6a' },
        { val: 960, err: 90, color: '#e3c790' },
      ],
      topLabel: '*',
      leftSig: '****',
      rightSig: '***',
    },
  ];
  const bw = 34;
  const gap = 8;

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grouped bar chart of skeletal muscle bundle cross-section area at 80 and 120 days">
      ${[0, 500, 1000, 1500].map((v) => `
        <line x1="${m.l}" y1="${yScale(v)}" x2="${W - m.r}" y2="${yScale(v)}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,4"/>
        <text x="${m.l - 10}" y="${yScale(v) + 4}" text-anchor="end" fill="#b6ada0" font-family="JetBrains Mono" font-size="11">${v}</text>
      `).join('')}

      <line x1="${m.l}" y1="${m.t}" x2="${m.l}" y2="${m.t + ph}" stroke="rgba(201,166,107,0.35)" />
      <line x1="${m.l}" y1="${m.t + ph}" x2="${W - m.r}" y2="${m.t + ph}" stroke="rgba(201,166,107,0.35)" />

      ${groups.map((g) => {
        const xs = [g.cx - bw - gap, g.cx, g.cx + bw + gap];
        const barsSvg = g.bars.map((b, i) => {
          const x = xs[i];
          const yTop = yScale(b.val);
          const yErr = yScale(b.val + b.err);
          return `
            <rect x="${x - bw / 2}" y="${yTop}" width="${bw}" height="${yScale(0) - yTop}" rx="5" fill="${b.color}" fill-opacity="0.88" />
            <line x1="${x}" y1="${yTop}" x2="${x}" y2="${yErr}" stroke="#faf6ef" stroke-width="1.5" />
            <line x1="${x - 7}" y1="${yErr}" x2="${x + 7}" y2="${yErr}" stroke="#faf6ef" stroke-width="1.5" />
          `;
        }).join('');

        // Significance brackets
        const yBr1 = yScale(1330);
        const yBrTop = yScale(1490);
        return `
          ${barsSvg}
          <line x1="${xs[0]}" y1="${yBr1}" x2="${xs[1] - 3}" y2="${yBr1}" stroke="#b6ada0" stroke-width="1.2" />
          <text x="${(xs[0] + xs[1]) / 2}" y="${yBr1 - 5}" text-anchor="middle" fill="#f4efe6" font-family="JetBrains Mono" font-size="10.5">${g.leftSig}</text>
          <line x1="${xs[1] + 3}" y1="${yBr1}" x2="${xs[2]}" y2="${yBr1}" stroke="#e3c790" stroke-width="1.2" />
          <text x="${(xs[1] + xs[2]) / 2}" y="${yBr1 - 5}" text-anchor="middle" fill="#e3c790" font-family="JetBrains Mono" font-size="10.5">${g.rightSig}</text>
          <line x1="${xs[0]}" y1="${yBrTop}" x2="${xs[2]}" y2="${yBrTop}" stroke="rgba(255,255,255,0.45)" stroke-width="1.1" />
          <text x="${g.cx}" y="${yBrTop - 6}" text-anchor="middle" fill="#b6ada0" font-family="JetBrains Mono" font-size="10.5">${g.topLabel}</text>
          <text x="${g.cx}" y="${H - 22}" text-anchor="middle" fill="#f4efe6" font-family="Plus Jakarta Sans" font-size="12" font-weight="600">${g.age}</text>
        `;
      }).join('')}

      <text x="${m.l + pw / 2}" y="${H - 4}" text-anchor="middle" fill="#b6ada0" font-family="Plus Jakarta Sans" font-size="11">Age (Days)</text>
      <text x="16" y="${m.t + ph / 2}" text-anchor="middle" fill="#b6ada0" font-family="Plus Jakarta Sans" font-size="11" transform="rotate(-90 16 ${m.t + ph / 2})">Muscle Bundle Area (µm²)</text>
    </svg>
  `;
}

// 5. LSD Market Growth Chart (Slide 5: $22B in 2021 -> $34B in 2030)
function renderMarketChart() {
  const el = document.getElementById('chartMarket');
  if (!el) return;
  const W = 480, H = 225;
  const m = { t: 30, r: 28, b: 38, l: 52 };
  const pw = W - m.l - m.r;
  const ph = H - m.t - m.b;

  // Smooth exponential trajectory from $22B (2021) to $34B (2030) (~4.95% CAGR)
  const pts = [
    { yr: '2021', val: 22.0, key: true },
    { yr: '2023', val: 24.2 },
    { yr: '2025', val: 26.7 },
    { yr: '2027', val: 29.4 },
    { yr: '2029', val: 32.4 },
    { yr: '2030E', val: 34.0, key: true },
  ];
  const xPad = 24;
  const xScale = (i) => m.l + xPad + (i / (pts.length - 1)) * (pw - 2 * xPad);
  const yScale = (v) => m.t + ph - ((v - 16) / (38 - 16)) * ph;

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${xScale(i).toFixed(1)},${yScale(p.val).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${xScale(pts.length - 1).toFixed(1)},${(m.t + ph).toFixed(1)} L${xScale(0).toFixed(1)},${(m.t + ph).toFixed(1)} Z`;

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Projected lysosomal storage disease drug market growth from 22 billion dollars in 2021 to 34 billion dollars by 2030">
      <defs>
        <linearGradient id="mktGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c9a66b" stop-opacity="0.34" />
          <stop offset="100%" stop-color="#c9a66b" stop-opacity="0.02" />
        </linearGradient>
      </defs>

      ${[20, 25, 30, 35].map((v) => `
        <line x1="${m.l}" y1="${yScale(v)}" x2="${W - m.r}" y2="${yScale(v)}" stroke="rgba(25,22,19,0.08)" stroke-dasharray="3,4" />
        <text x="${m.l - 8}" y="${yScale(v) + 4}" text-anchor="end" fill="#6f665b" font-family="JetBrains Mono" font-size="10.5">$${v}B</text>
      `).join('')}

      <path d="${areaPath}" fill="url(#mktGrad)" />
      <path d="${linePath}" fill="none" stroke="#9c793e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

      ${pts.map((p, i) => `
        <circle cx="${xScale(i)}" cy="${yScale(p.val)}" r="${p.key ? 5.5 : 3.5}" fill="${p.key ? '#191613' : '#c9a66b'}" stroke="#faf8f4" stroke-width="2" />
        ${p.key ? `<text x="${xScale(i)}" y="${yScale(p.val) - 12}" text-anchor="middle" fill="#191613" font-family="JetBrains Mono" font-size="12" font-weight="700">$${p.val.toFixed(0)}B</text>` : ''}
        <text x="${xScale(i)}" y="${H - 12}" text-anchor="middle" fill="#6f665b" font-family="JetBrains Mono" font-size="10.5">${p.yr}</text>
      `).join('')}
    </svg>
  `;
}

/* -------------------- Scientific Figure Lightbox -------------------- */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const backdrop = document.getElementById('lightboxBackdrop');

  function open(src, caption, alt) {
    lbImg.src = src;
    lbImg.alt = alt || caption || '';
    lbCap.textContent = caption || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.zoomable').forEach((el) => {
    el.addEventListener('click', () => {
      const img = el.querySelector('img');
      open(el.dataset.src || img?.src, el.dataset.caption, img?.alt);
    });
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('open')) close();
  });
}

/* -------------------- Contact Form & Copy Email -------------------- */
function initContactForm() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('suleiman.igdoura@lysogenix.com');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => (copyBtn.textContent = 'Copy'), 1800);
      } catch {
        copyBtn.textContent = 'suleiman.igdoura@lysogenix.com';
      }
    });
  }

  const form = document.getElementById('contactForm');
  const fb = document.getElementById('formFeedback');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.senderName.value.trim();
    const org = form.senderOrg.value.trim();
    const email = form.senderEmail.value.trim();
    const topic = form.inquiryType.value;
    const message = form.senderMessage.value.trim();

    if (!name || !email || !message) {
      fb.className = 'form-feedback err';
      fb.textContent = 'Please complete all required fields (Name, Work Email, and Message).';
      return;
    }

    const subject = encodeURIComponent(`[Lysogenix Inquiry — ${topic}] from ${name}${org ? ` (${org})` : ''}`);
    const body = encodeURIComponent(
      `Name: ${name}\nOrganization: ${org || 'N/A'}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`
    );
    const mailto = `mailto:suleiman.igdoura@lysogenix.com?subject=${subject}&body=${body}`;

    fb.className = 'form-feedback ok';
    fb.innerHTML = `Your inquiry is ready! Opening your mail client — or <a href="${mailto}" style="text-decoration:underline;color:#e3c790;">click here to send directly</a> to suleiman.igdoura@lysogenix.com.`;
    window.location.href = mailto;
  });
}

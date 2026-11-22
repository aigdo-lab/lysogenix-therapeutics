/* ==========================================================================
   Lysogenix Therapeutics Inc. — Interactive Scripts (BeamTX Presentation)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderAndOverlay();
  initScrollReveal();
  initPrismHeroCanvas();
  initFocusPillTabs();
  initInquiryModalAndCopy();

  const yr = document.getElementById('yearNow');
  if (yr) yr.textContent = new Date().getFullYear();
});

/* -------------------- Floating Header & Full-Screen Overlay Menu -------------------- */
function initHeaderAndOverlay() {
  const header = document.getElementById('siteHeader');
  const toggleBtn = document.getElementById('menuToggleBtn');
  const closeBtn = document.getElementById('menuCloseBtn');
  const overlay = document.getElementById('menuOverlay');

  const onScroll = () => {
    header.classList.toggle('is-scrolling', window.scrollY > 120);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function openMenu() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.querySelectorAll('[data-close-menu]').forEach((el) => {
    el.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeMenu();
  });
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
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

/* -------------------- Drifting Translucent Gold Prism Shards (Beam Hero Motif) -------------------- */
function initPrismHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let w, h, shards;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    const count = Math.min(28, Math.max(14, Math.floor((w * h) / 48000)));
    shards = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 16 + Math.random() * 38,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.0035,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.22,
      alpha: 0.04 + Math.random() * 0.1,
      strokeOnly: Math.random() > 0.55,
    }));
  }

  function drawTriangle(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);
    ctx.beginPath();
    ctx.moveTo(0, -s.size * 0.62);
    ctx.lineTo(s.size * 0.58, s.size * 0.45);
    ctx.lineTo(-s.size * 0.58, s.size * 0.45);
    ctx.closePath();

    if (s.strokeOnly) {
      ctx.strokeStyle = `rgba(227, 199, 144, ${s.alpha * 1.45})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      ctx.fillStyle = `rgba(201, 166, 107, ${s.alpha})`;
      ctx.fill();
    }
    ctx.restore();
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    for (const s of shards) {
      s.x += s.vx;
      s.y += s.vy;
      s.angle += s.spin;
      if (s.x < -60) s.x = w + 60;
      if (s.x > w + 60) s.x = -60;
      if (s.y < -60) s.y = h + 60;
      if (s.y > h + 60) s.y = -60;
      drawTriangle(s);
    }
    requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', resize);
  step();
}

/* -------------------- Beam-Style Spring-Animated Pill Tabs -------------------- */
function initFocusPillTabs() {
  const container = document.getElementById('focusTabs');
  const selector = document.getElementById('tabSelector');
  const summaryEl = document.getElementById('focusSummary');
  const cardsEl = document.getElementById('focusCards');
  if (!container || !selector) return;

  const tabs = Array.from(container.querySelectorAll('.pill-tab'));

  const content = {
    gm2: {
      summary:
        'Advancing patented 4-PBA for early- and late-onset Tay-Sachs and Sandhoff disease—targeting ER stress-driven motor neuron degeneration with an accelerated translational path.',
      cards: [
        {
          label: 'INDICATIONS',
          stat: 'Tay-Sachs & Sandhoff',
          text: 'Monogenic GM2 gangliosidoses spanning infantile, juvenile, and late-onset presentations.',
          accent: false,
        },
        {
          label: 'MECHANISM',
          stat: 'ER Stress Modulation',
          text: 'Chemical chaperone activity rebalances unfolded protein response signaling to protect spinal cord motor neurons.',
          accent: true,
        },
        {
          label: 'PRECLINICAL PROOF',
          stat: 'Function & Survival',
          text: 'Demonstrated motor neuron preservation, myofibril maintenance, and significant lifespan extension in severe disease models.',
          accent: false,
        },
      ],
    },
    derivatives: {
      summary:
        'Building a differentiated small-molecule pipeline centered on 4-PBA and novel chemical chaperone derivatives to address broader Lysosomal Storage and neurodegenerative disorders.',
      cards: [
        {
          label: 'INTELLECTUAL PROPERTY',
          stat: 'Issued Patent',
          text: 'Protected composition and therapeutic use covering 4-PBA for ER stress-induced neurodegeneration in GM2.',
          accent: true,
        },
        {
          label: 'PLATFORM EXPANSION',
          stat: 'Next-Gen Derivatives',
          text: 'Immediate growth plan extends beyond repurposed 4-PBA to optimized proprietary analogs.',
          accent: false,
        },
        {
          label: 'BROADER REACH',
          stat: '1 in 5,000',
          text: 'Combined incidence of Lysosomal Storage Diseases, sharing convergent ER stress pathology.',
          accent: false,
        },
      ],
    },
    opportunity: {
      summary:
        'Rare neurodegenerative and lysosomal storage diseases combine urgent patient need with sustained commercial growth—creating an ideal setting for capital-efficient drug repurposing.',
      cards: [
        {
          label: 'ORPHAN DRUG SECTOR',
          stat: '$124B',
          text: 'Global orphan drug sales (2020), projected to expand at ~11% CAGR (EvaluatePharma).',
          accent: false,
        },
        {
          label: 'LSD THERAPEUTICS',
          stat: '$34B by 2030',
          text: 'Lysosomal storage disease drug market growing from an estimated $22B in 2021.',
          accent: true,
        },
        {
          label: 'CAPITAL EFFICIENCY',
          stat: 'Repurposing Edge',
          text: 'De novo drug development averages ~$800M; repurposing FDA-approved 4-PBA streamlines clinical translation.',
          accent: false,
        },
      ],
    },
  };

  function moveSelector(activeTab) {
    const rect = activeTab.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();
    selector.style.width = `${rect.width}px`;
    selector.style.transform = `translateX(${rect.left - parentRect.left - 5}px)`;
  }

  function renderFocus(key) {
    const data = content[key];
    summaryEl.textContent = data.summary;
    cardsEl.innerHTML = data.cards
      .map(
        (c) => `
        <article class="focus-card ${c.accent ? 'accent' : ''}">
          <div>
            <div class="focus-card-label">${c.label}</div>
            <div class="focus-card-stat">${c.stat}</div>
          </div>
          <p>${c.text}</p>
        </article>`
      )
      .join('');
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      moveSelector(tab);
      renderFocus(tab.dataset.focus);
    });
  });

  renderFocus('gm2');
  // Position selector once fonts/layout settle
  requestAnimationFrame(() => moveSelector(tabs[0]));
  window.addEventListener('resize', () => {
    const current = container.querySelector('.pill-tab.active');
    if (current) moveSelector(current);
  });
}

/* -------------------- Inquiry Modal & Copy Email -------------------- */
function initInquiryModalAndCopy() {
  const modal = document.getElementById('inquiryModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalCloseBtn');
  const openBtns = [document.getElementById('openInquiryBtn'), document.getElementById('footerInquiryBtn')].filter(Boolean);

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach((b) => b.addEventListener('click', openModal));
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  const copyBtn = document.getElementById('copyEmailBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('suleiman.igdoura@lysogenix.com');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => (copyBtn.textContent = 'Copy email'), 1800);
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
    const message = form.senderMessage.value.trim();

    if (!name || !email || !message) {
      fb.className = 'form-feedback err';
      fb.textContent = 'Please complete Name, Email, and Message.';
      return;
    }

    const subject = encodeURIComponent(`[Lysogenix Therapeutics] Inquiry from ${name}${org ? ` (${org})` : ''}`);
    const body = encodeURIComponent(`Name: ${name}\nOrganization: ${org || 'N/A'}\nEmail: ${email}\n\n${message}`);
    const mailto = `mailto:suleiman.igdoura@lysogenix.com?subject=${subject}&body=${body}`;

    fb.className = 'form-feedback ok';
    fb.innerHTML = `Opening your email client — or <a href="${mailto}" style="text-decoration:underline;color:#e3c790;">click here to send</a>.`;
    window.location.href = mailto;
  });
}

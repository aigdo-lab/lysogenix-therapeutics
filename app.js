/* ==========================================================================
   Lysogenix Therapeutics Inc. — Minimal Interactive Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderAndNav();
  initScrollReveal();
  initHeroCanvas();
  initLightbox();
  initContactForm();

  const yr = document.getElementById('yearNow');
  if (yr) yr.textContent = new Date().getFullYear();
});

function initHeaderAndNav() {
  const header = document.getElementById('siteHeader');
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks.querySelectorAll('a[href^="#"]');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 80);
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

function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let w, h, nodes;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    const count = Math.min(38, Math.max(16, Math.floor((w * h) / 34000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      r: 1.3 + Math.random() * 1.9,
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
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 145) {
          ctx.strokeStyle = `rgba(201, 166, 107, ${(1 - dist / 145) * 0.2})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = 'rgba(227, 199, 144, 0.52)';
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
    const message = form.senderMessage.value.trim();

    if (!name || !email || !message) {
      fb.className = 'form-feedback err';
      fb.textContent = 'Please complete Name, Email, and Message.';
      return;
    }

    const subject = encodeURIComponent(`[Lysogenix Therapeutics] Inquiry from ${name}${org ? ` (${org})` : ''}`);
    const body = encodeURIComponent(
      `Name: ${name}\nOrganization: ${org || 'N/A'}\nEmail: ${email}\n\n${message}`
    );
    const mailto = `mailto:suleiman.igdoura@lysogenix.com?subject=${subject}&body=${body}`;

    fb.className = 'form-feedback ok';
    fb.innerHTML = `Opening your email client — or <a href="${mailto}" style="text-decoration:underline;color:#e3c790;">click here to send</a> to suleiman.igdoura@lysogenix.com.`;
    window.location.href = mailto;
  });
}
